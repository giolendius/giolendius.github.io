import os
from time import sleep
from typing import List, Dict
from urllib.parse import quote_plus

import pandas as pd
import requests
import xmltodict
from bs4 import BeautifulSoup

from constants.column_names import BGGColumnNames
from constants.constants import ITPublishers, CompetitionType
from .googlesheet import GoogleSheetLoader
from .utils import setup_logger, logging


class BggUpdater:
    column_names: List[BGGColumnNames]
    google_sheet: GoogleSheetLoader
    ask_for_input: bool
    skip_to_end = False

    def __init__(self, verbose=False):
        self.logger = setup_logger('GEEK', verbose, 1)
        logging.getLogger("urllib3").setLevel(logging.WARNING)
        self.sleep_time = 1
        self.df = pd.DataFrame()
        self.games_not_changed = 0
        self.games_automatically_update_col = 0
        self.games_updated_with_user_confirmation = 0

    def load_worksheet(self):
        self.google_sheet = GoogleSheetLoader()
        self.df = self.google_sheet.get_dataframe()

    def get_bgg_url(self, game_name: str) -> str:
        """Search a game in BGG and return the URL"""

        search_url = (f"https://boardgamegeek.com/geeksearch.php?action="
                      f"search&objecttype=boardgame&q={quote_plus(game_name)}")
        try:
            search_response = requests.get(search_url)
            if search_response.status_code == 429:
                m = 5
                s = 1
                for i in range(m):
                    self.logger.info(f'Too many call, waiting.. {i + 1}/{m}')
                    sleep(s)
                search_response = requests.get(search_url)
            if search_response.status_code != 200:
                raise f"Failed to search for {game_name}, status was {search_response.status_code}"

            soup = BeautifulSoup(search_response.text, "html.parser")
            # OLD:
            # result = soup.find("a", class_="primary")
            # if not result:
            #     return f"No results found for {game_name}"
            # else:
            #     print(f"Result for {game_name} is {result}")

            link = ''
            for a in soup.find_all("a", class_="primary", href=True):
                href: str = a.get("href")
                text = a.get_text(strip=True).lower()
                if game_name.lower() in text:
                    link = "https://boardgamegeek.com" + href
                    break

        except Exception as e:
            self.logger.critical('Qualcosa non è andato con ricerca URL.\n'
                                 'Interrompo e salvo il lavoro fatto.\n'
                                 f'Errore: {e}')
            link = ''
            self.skip_to_end = True

        return link

    @staticmethod
    def get_bgg_id_from_url(bgg_url: str) -> str:
        string_from_id = bgg_url.lstrip('https://boardgamegeek.com/boardgamexpansion')
        game_id = string_from_id[:string_from_id.find('/')]
        return game_id

    def call_and_format_api(self, game_id: str, title: str = '') -> dict:
        try:
            int(game_id)
        except ValueError:
            self.logger.warning('Invalid game id for Api, call not possible')
            return {}

        resp = self.api_call(game_id)

        sleep(self.sleep_time)
        xml_str = resp.text
        dict_xml_game = xmltodict.parse(xml_str)['items']['item']

        best = [a['@value'] for a in dict_xml_game['poll-summary']['result'] if a['@name'] == "bestwith"][0]
        recomm = [a['@value'] for a in dict_xml_game['poll-summary']['result'] if a['@name'] == 'recommmendedwith'][0]
        competition = get_competition(dict_xml_game['link'])
        authors = ', '.join([v['@value'] for v in dict_xml_game['link'] if v['@type'] == 'boardgamedesigner'])
        rank = get_rank(dict_xml_game)

        polished_dict_game = {
            BGGColumnNames.PLAYERS_MIN: dict_xml_game['minplayers']['@value'],
            BGGColumnNames.PLAYERS_MAX: dict_xml_game['maxplayers']['@value'],
            BGGColumnNames.PLAYERS_BEST: best,
            BGGColumnNames.PLAYERS_RECOMMENDED: recomm,
            BGGColumnNames.COMPETITION_CAT: competition,
            BGGColumnNames.DIFFICULTY_WEIGHT: dict_xml_game['statistics']['ratings']['averageweight']['@value'],
            BGGColumnNames.DURATION_VAL: dict_xml_game['playingtime']['@value'],
            BGGColumnNames.YEAR: dict_xml_game['yearpublished']['@value'],
            BGGColumnNames.AUTHORS: authors,
            BGGColumnNames.RANK: rank,
            BGGColumnNames.LINK_IMG: dict_xml_game['image'],
        }

        publishers = [v['@value'] for v in dict_xml_game['link'] if v['@type'] == 'boardgamepublisher']
        publisher_it = list(set(publishers) & ITPublishers.keys())
        self.logger.debug(
            f'For game {title} found publishers: \n {publishers} \n So IT publisher we got: {publisher_it}')
        if publishers:
            polished_dict_game |= {
                BGGColumnNames.PUBLISHER: publishers[0]
            }
        if publisher_it:
            polished_dict_game |= {
                BGGColumnNames.PUBLISHER_IT: ITPublishers[publisher_it[0]]
            }

        return polished_dict_game

    def api_call(self, game_id: str) -> requests.Response:
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0",
            "Authorization": f"Bearer {os.getenv('BGG_AUTHORIZATION')}"
        }
        api_url = f"https://boardgamegeek.com/xmlapi2/thing?id={game_id}&stats=1"
        success, resp = False, None
        while not success:
            resp = requests.get(api_url, headers=headers)
            if resp.status_code == 200:
                success = True
            elif resp.status_code == 401:
                raise ConnectionError(f"Unauthorized to use BGG Api")
            elif resp.status_code in [429, 500, 503]:
                self.logger.warning('Too many calls maybe!')
                sleep(10)
                self.sleep_time += 1
            else:
                raise ConnectionError(f"Failed to get data for game id {game_id}, status code: {resp.status_code}")
        return resp

    def update_games_and_upload(self,
                                column_names_to_update: BGGColumnNames | List[BGGColumnNames] = 'all',
                                ask_for_input: bool = False):
        """Update the df with BGG_LINK and """
        try:
            self.start_row = int(input('From which row to start? (1,2,...)'))
        except ValueError:
            print('you did not insert a valid number. Starting from above')
            self.start_row = 1
        if column_names_to_update == 'all':
            column_names_to_update = list(BGGColumnNames)
        elif isinstance(column_names_to_update, BGGColumnNames):
            column_names_to_update = [column_names_to_update]

        # Remove Title and move BGG_LINK as first feature
        for column_to_remove in [BGGColumnNames.LINK_BGG, BGGColumnNames.TITLE]:
            if column_to_remove in column_names_to_update:
                column_names_to_update.remove(column_to_remove)
        column_names_to_update.insert(0, BGGColumnNames.LINK_BGG)
        self.column_names = column_names_to_update
        self.ask_for_input = ask_for_input

        self.logger.info(f'Starting updating columns: {column_names_to_update}')

        updated_df = self.df
        updated_df[column_names_to_update] = updated_df.apply(self._update_game_info, axis=1)

        self.logger.info(f'Updated {len(updated_df)} rows of {column_names_to_update}')

        confirmation: str = input("Are you sure you want to update Google Sheet? (Y)")
        if confirmation.lower() == 'y':
            self.google_sheet.upload_df(updated_df)

    def _update_game_info(self, row: pd.Series) -> pd.Series:
        """For a given row-game, find a link and update the game

        if skip to end is true, returns the original row without change

        if game has already values for all fields, skip the game

        if URL is confirmed (column = 'si') take it, otherwise b4s the link.

        If any link is given or found, proceed with API call.

        If any retrieved field successfully retrieved from the api is different from the value found in the sheet,
        program asks whether to proceed or not.
        If instead there wasn't a previous value, any value retrieved from the api is automatically updated.
        If the BGG link is confirmed, any value retrieved from the api is automatically updated.
        """

        if self.skip_to_end or row.name +1 < self.start_row:
            self.games_not_changed += 1
            return row[self.column_names]
        game_info_dict = row[self.column_names].to_dict()
        title = row[BGGColumnNames.TITLE]
        previous_url = row[BGGColumnNames.LINK_BGG]
        flg_url_confirmed = True if row[BGGColumnNames.FLG_LINK_BGG] == 'si' else False

        self.logger.warning(f'Processing game "{title}"')
        # GET LINK BGG
        if not flg_url_confirmed:
            found_url = self.get_bgg_url(title)
        else:
            found_url = previous_url

        if not len([empty_field for empty_field in game_info_dict.values() if not empty_field]):
            self.logger.info(f"♥️ Game {title} has all information")
            self.games_not_changed += 1
            return row[self.column_names]
        if not flg_url_confirmed and not found_url:
            self.logger.critical(f"😡🔍 BGG URL not found for {title}. Skipping")
            self.games_not_changed += 1
            return row[self.column_names]
        elif not previous_url:
            # no previous link: we take it
            self.logger.debug(f'No previous LinkBGG, found URL: {found_url}')
            game_info_dict[BGGColumnNames.LINK_BGG] = found_url
        elif previous_url == found_url:
            # two link matches, true if URL was confirmed
            self.logger.debug(f'Existing and found link match: {found_url}')
            game_info_dict[BGGColumnNames.LINK_BGG] = found_url
        else:
            self.logger.critical(f'❓ Different LinkBGG for {title}. \n'
                                 f'Existing: {row[BGGColumnNames.LINK_BGG]}\n'
                                 f'Found URL: {found_url}\n Not updating')
            # return row[self.column_names]

        game_id = self.get_bgg_id_from_url(found_url)
        new_info_dict = self.call_and_format_api(game_id, title)

        common_fields = {field_name: [game_info_dict[field_name], new_info_dict[field_name]] for field_name in
                         game_info_dict.keys() & new_info_dict.keys()}

        updating_fields_previously_empty = {name: (old_val, new_val)
                                            for name, (old_val, new_val) in common_fields.items()
                                            if '' == old_val}
        # updating_fields_not_empty_equals = {name: (old_val, new_val)
        #                                     for name, (old_val, new_val) in common_fields.items()
        #                                     if '' != old_val == new_val}
        updating_fields_not_empty_but_different = {name: (old_val, new_val)
                                                   for name, (old_val, new_val) in common_fields.items()
                                                   if '' != old_val != new_val}
        # The number of keys should satisfy:
        #               pre_empty + n_e_equals + n_e_different = common_keys

        num_problematic_updating_fields = len(updating_fields_not_empty_but_different)

        if flg_url_confirmed:
            self.logger.info(
                f'In game "{title}" added {len(updating_fields_previously_empty)} fields and automatically '
                f'changed {num_problematic_updating_fields} fields as URL was confirmed')
            game_info_dict.update(new_info_dict)
            self.games_automatically_update_col += 1
        elif num_problematic_updating_fields:
            new_field_registry = "\n".join([f"{field}: {new_val}"
                                            for field, (_, new_val) in
                                            common_fields.items()])
            self.logger.info(f'All new fields are: \n {new_field_registry}')

            update_registry = '\n'.join([f"Changing {field}:\n"
                                         f"    from {old_val}\n"
                                         f"    to {new_val}"
                                         for field, (old_val, new_val) in
                                         updating_fields_not_empty_but_different.items()])
            self.logger.error(f' ⁉️ Different fields for game {title}!\n'
                              f'Found URL was {found_url}\n'
                              f"{update_registry}")

            if self.ask_for_input:
                user_input = input(
                    f'Do you want to update {num_problematic_updating_fields} fields for "{title}",'
                    f' or save and close?? (y, stop, *)  ')
                if user_input.lower() == 'y':
                    self.logger.info(f'Updating {num_problematic_updating_fields} fields in "{title}"')
                    game_info_dict.update(new_info_dict)
                    game_info_dict.update({BGGColumnNames.FLG_LINK_BGG: 'si'})
                    self.games_updated_with_user_confirmation += 1
                elif user_input.lower() == 'stop':
                    self.logger.critical('Saving all games done, skipping to the end')
                    self.skip_to_end = True
                    self.games_not_changed += 1
                else:
                    self.logger.info(f'Skipping update for "{title}" as per user request')
                    self.games_not_changed += 1
            else:
                self.logger.critical(f'Not updating {title}')
                self.games_not_changed += 1
        else:
            self.logger.info(f'In game "{title}" added {len(updating_fields_previously_empty)} fields')
            game_info_dict.update(new_info_dict)
            self.games_automatically_update_col += 1

        return pd.Series(game_info_dict)

    def print_report(self):
        self.logger.info(f'Games not changed: {self.games_not_changed}')
        self.logger.info(f'Games automatically updated: {self.games_automatically_update_col}')
        self.logger.info(f'Games updated with user confirmation: {self.games_updated_with_user_confirmation}')


def get_competition(dict_xmg_game_links: List[dict]) -> str:
    competition_dict: Dict[str, str] = {'Cooperative Game': CompetitionType.COOP,
                                        'Team-Based Game': CompetitionType.TEAMS,
                                        'Semi-Cooperative Game': CompetitionType.SEMI_COOP,
                                        'Solo / Solitaire Game': CompetitionType.SOLO}
    competition_preliminary = [competition_dict[mechanic['@value']]
                               for mechanic in dict_xmg_game_links if mechanic['@value'] in competition_dict.keys()]
    if not competition_preliminary or competition_preliminary == [CompetitionType.SOLO]:
        competition_preliminary += [CompetitionType.COMP]

    competition = ', '.join(competition_preliminary)
    return competition


def get_rank(dict_xml_game) -> str:
    ranks = dict_xml_game['statistics']['ratings']['ranks']['rank']
    ranks_list = ranks if isinstance(ranks, list) else [ranks]
    return [rank['@value'] for rank in ranks_list if rank['@name'] == 'boardgame'][0]
