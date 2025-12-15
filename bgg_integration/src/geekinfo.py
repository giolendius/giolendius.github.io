from bs4 import BeautifulSoup

import pandas as pd
import requests
from time import sleep
from typing import List
import os
from urllib.parse import quote_plus
import xmltodict

from constants.types import ColumnNames
from .googlesheet import GoogleSheet
from .utils import setup_logger


class BggUpdater:
    column_names: List[ColumnNames]
    def __init__(self):
        self.logger = setup_logger('GEEK')
        self.google_sheet = GoogleSheet()
        self.df = self.google_sheet.get_dataframe()
        self.sleep_time = 0.5


    def get_bgg_url(self, game_name: str) -> str:
        """Search a game in BGG and return the URL"""

        self.logger.debug(f'Searching BGG for {game_name}')
        search_url = f"https://boardgamegeek.com/geeksearch.php?action=search&objecttype=boardgame&q={quote_plus(game_name)}"
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

        string_from_id = bgg_url.strip('https://boardgamegeek.com/boardgame/')
        game_id = string_from_id[:string_from_id.find('/')]
        return game_id


    def direct_api(self, game_id: str) -> dict:
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0",
            "Authorization": f"Bearer {os.getenv('BGG_AUTHORIZATION')}"
        }

        url = f"https://boardgamegeek.com/xmlapi2/thing?id={game_id}&stats=1"

        resp = requests.get(url, headers=headers)
        if resp.status_code == 401:
            raise ConnectionError(f"Unauthorized to use BGG Api")
        elif resp.status_code in [500, 503]:
            self.logger.warning('Too many calls maybe!')
            self.sleep_time += 1

        sleep(self.sleep_time)
        xml_str = resp.text
        dict_xml_game = xmltodict.parse(xml_str)['items']['item']

        polished_dict_game = {
            ColumnNames.PLAYERS_MIN: dict_xml_game['minplayers']['@value'],
            ColumnNames.PLAYERS_MAX: dict_xml_game['maxplayers']['@value'],
            ColumnNames.DURATION_VAL: dict_xml_game['playingtime']['@value'],
            ColumnNames.YEAR: dict_xml_game['yearpublished']['@value'],
            ColumnNames.LINK_IMG: dict_xml_game['image']
        }

        return polished_dict_game


    def update_games_and_upload(self, column_names: ColumnNames | List[ColumnNames] = 'all') -> pd.DataFrame:
        """Update the df with BGG_LINK and """
        if column_names == 'all':
            column_names = list(ColumnNames)
        elif isinstance(column_names, ColumnNames):
            column_names = [column_names]


        # Remove info which are our private knowledge and move BGG_LINK as first feature
        for column_to_remove in [ColumnNames.LINK_BGG, ColumnNames.TITLE, ColumnNames.PLACE_CURRENT]:
            if column_to_remove in column_names:
                column_names.remove(column_to_remove)
        column_names.insert(0, ColumnNames.LINK_BGG)
        self.column_names = column_names

        self.logger.info(f'Starting Updating columns: {column_names}')

        updated_df = self.df
        updated_df[column_names] = updated_df.apply(self._update_game_info, axis=1)

        self.logger.info(f'Updated {len(updated_df)} rows of {column_names}')
        self.google_sheet.upload_df(updated_df)
        return updated_df


    def _update_game_info(self, row: pd.Series) -> pd.Series:
        game_info_dict = row[self.column_names].to_dict()
        title = row[ColumnNames.TITLE]
        self.logger.info(f'Updating {title}')

        # LINK BGG
        found_url = self.get_bgg_url(title)
        if not row[ColumnNames.LINK_BGG]:
            game_info_dict[ColumnNames.LINK_BGG] = found_url
        elif row[ColumnNames.LINK_BGG] == found_url:
            pass
        else:
            self.logger.warning(f'Differenti LinkBGG per {title}. \n'
                                f'Existing: {row[ColumnNames.LINK_BGG]}\n'
                                f'Found URL: {found_url}\n Not updating')
            return row[self.column_names]

        game_id = self.get_bgg_id_from_url(found_url)
        new_info_dict = self.direct_api(game_id)

        common_keys = game_info_dict.keys() & new_info_dict.keys()
        updating_fields = {field_name: [game_info_dict[field_name], new_info_dict[field_name]] for field_name in
                           common_keys
                           if '' != game_info_dict[field_name] != new_info_dict[field_name]}
        num_updating_fields = len(updating_fields)

        if num_updating_fields:
            self.logger.warning(f'Different fields for game {title}\n'
                                f'Found URL was {found_url}\n'
                                f'{updating_fields}\n Not updating')
        else:
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
