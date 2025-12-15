from bs4 import BeautifulSoup

import pandas as pd
import requests
from time import sleep
from typing import List
import os
from urllib.parse import quote_plus
import xmltodict

from constants.types import BGGColumnNames
from .googlesheet import GoogleSheetLoader
from .utils import setup_logger


class BggUpdater:
    column_names: List[BGGColumnNames]
    google_sheet: GoogleSheetLoader

    def __init__(self):
        self.logger = setup_logger('GEEK')
        self.sleep_time = 0.5
        self.df = pd.DataFrame()

    def load_worksheet(self):
        self.google_sheet = GoogleSheetLoader()
        self.df = self.google_sheet.get_dataframe()

    def get_bgg_url(self, game_name: str) -> str:
        """Search a game in BGG and return the URL"""

        self.logger.debug(f'Searching BGG for {game_name}')
        search_url = (f"https://boardgamegeek.com/geeksearch.php?action="
                      f"search&objecttype=boardgame&q={quote_plus(game_name)}")
        search_response = requests.get(search_url)
        if search_response.status_code == 429:
            m = 5
            s = 1
            for i in range(m):
                self.logger.info(f'Too many call, waiting.. {i+1}/{m}')
                sleep(s)
            search_response = requests.get(search_url)
        if search_response.status_code != 200:
            raise f"Failed to search for {game_name}"

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

        return link or ''

    @staticmethod
    def get_bgg_id_from_url(bgg_url: str) -> str:
        string_from_id = bgg_url.lstrip('https://boardgamegeek.com/boardgamexpansion')
        game_id = string_from_id[:string_from_id.find('/')]
        return game_id

    def direct_api(self, game_id: str) -> dict:

        try:
            int(game_id)
        except ValueError:
            self.logger.warning('Invalid game id for Api, call not possible')
            return {}

        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0",
            "Authorization": f"Bearer {os.getenv('BGG_AUTHORIZATION')}"
        }

        api_url = f"https://boardgamegeek.com/xmlapi2/thing?id={game_id}&stats=1"

        resp = requests.get(api_url, headers=headers)
        if resp.status_code == 401:
            raise ConnectionError(f"Unauthorized to use BGG Api")
        elif resp.status_code in [500, 503]:
            self.logger.warning('Too many calls maybe!')
            self.sleep_time += 1

        sleep(self.sleep_time)
        xml_str = resp.text
        dict_xml_game = xmltodict.parse(xml_str)['items']['item']

        polished_dict_game = {
            BGGColumnNames.PLAYERS_MIN: dict_xml_game['minplayers']['@value'],
            BGGColumnNames.PLAYERS_MAX: dict_xml_game['maxplayers']['@value'],
            BGGColumnNames.DURATION_VAL: dict_xml_game['playingtime']['@value'],
            BGGColumnNames.YEAR: dict_xml_game['yearpublished']['@value'],
            BGGColumnNames.LINK_IMG: dict_xml_game['image']
        }

        return polished_dict_game

    def update_games_and_upload(self,
                                column_names_to_update: BGGColumnNames | List[BGGColumnNames] = 'all'):
        """Update the df with BGG_LINK and """
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

        self.logger.info(f'Starting updating columns: {column_names_to_update}')

        updated_df = self.df
        updated_df[column_names_to_update] = updated_df.apply(self._update_game_info, axis=1)

        self.logger.info(f'Updated {len(updated_df)} rows of {column_names_to_update}')

        confirmation: str = input("Are you sure you want to update Google Sheet? (Y)")
        if confirmation.lower() == 'y':
            self.google_sheet.upload_df(updated_df)

    def _update_game_info(self, row: pd.Series) -> pd.Series:
        """For a given row-game, find a link and update the game"""
        game_info_dict = row[self.column_names].to_dict()
        title = row[BGGColumnNames.TITLE]
        previous_url = row[BGGColumnNames.LINK_BGG]

        # GET LINK BGG
        if not previous_url:
            found_url = self.get_bgg_url(title)
        else:
            found_url = None

        if not len([field for field in game_info_dict.values() if not field]):
            self.logger.info(f"♥️ Game {title} has all information")
            return row[self.column_names]
        if not previous_url and not found_url:
            self.logger.warning(f"😡🔍 BGG URL not found for {title}. Skipping")
            return row[self.column_names]
        elif not row[BGGColumnNames.LINK_BGG]:
            # no previous link
            game_info_dict[BGGColumnNames.LINK_BGG] = found_url
        elif row[BGGColumnNames.LINK_BGG] == found_url:
            # two link matches
            pass
        else:
            self.logger.warning(f'❓ Different LinkBGG for {title}. \n'
                                f'Existing: {row[BGGColumnNames.LINK_BGG]}\n'
                                f'Found URL: {found_url}\n Not updating')
            return row[self.column_names]

        game_id = self.get_bgg_id_from_url(found_url)
        new_info_dict = self.direct_api(game_id)

        common_keys = game_info_dict.keys() & new_info_dict.keys()
        updating_fields = {field_name: [game_info_dict[field_name], new_info_dict[field_name]] for field_name in
                           common_keys}
        updating_fields_not_empty = {name: (old_val, new_val) for name, (old_val, new_val) in updating_fields.items() if '' != old_val != new_val}
        num_updating_fields = len(updating_fields_not_empty)

        if num_updating_fields:
            update_registry = '\n'.join([f"    Changing {field}\n"
                                         f"    from {old_val}\n"
                                         f"    to {new_val}"
                                         for field, (old_val, new_val) in updating_fields_not_empty.items()])
            self.logger.warning(f' ⁉️ Different fields for game {title}\n'
                                f'    Found URL was {found_url}\n'
                                f"{update_registry}\n Not updating")
        else:
            self.logger.info(f'Updating {len(updating_fields)} fields in "{title}"')
            game_info_dict.update(new_info_dict)

        return pd.Series(game_info_dict)

    def get_boardgame_image_url(self, game_name):
        """Old function to get html from url and extract image url"""
        game_url = self.get_bgg_url(game_name)

        self.logger.info(f'Got url: {game_url}')
        html = requests.get(game_url).text
        game_soup = BeautifulSoup(html, 'html.parser')

        game_div = game_soup.find("div", class_="game-header")

        game_soup.find_all("p", class_="gameplay")

        image_tag = game_soup.find("img", {"class": "game-header-image"})

        if not image_tag or not image_tag.get("src"):
            return f"No image found for {game_name}"

        path = "src/miooutput.html"
        html = game_div.prettify()
        print(html)
        with open(path, "w", encoding="utf-8") as f:
            f.write("<!doctype html>\n")
            f.write(html)
        self.logger.info('Html printed')
        return None
