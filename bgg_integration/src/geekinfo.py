from bs4 import BeautifulSoup

import pandas as pd
import requests
from time import sleep
from typing import List
import os
from urllib.parse import quote_plus
import xmltodict

from constants.types import ColumnNames
from .utils import setup_logger


headers = {"User-Agent": "Mozilla/5.0"}
logger = setup_logger('GEEK')
sleep_time = 0.5

def get_boardgame_image_url(game_name):
    game_url = get_bgg_url(game_name)

    logger.info(f'Got url: {game_url}')
    # game_soup = BeautifulSoup(html, 'html.parser')

    # game_div = game_soup.find("div", class_="game-header")

    # game_soup.find_all("p", class_="gameplay")

    # image_tag = game_soup.find("img", {"class": "game-header-image"})
    #
    # if not image_tag or not image_tag.get("src"):
    #     return f"No image found for {game_name}"

    path = "src/miooutput.html"
    # html = game_div.prettify()
    # print(html)
    # with open(path, "w", encoding="utf-8") as f:
    #     f.write("<!doctype html>\n")
    #     f.write(html)
    # logger.info('Html printed')
    return None  # image_tag["src"]




def get_bgg_url(game_name: str) -> str:
    """Search a game in BGG and return the URL"""
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

    for a in soup.find_all("a", class_="primary", href=True):
        href = a.get("href")

        text = a.get_text(strip=True).lower()
        if game_name.lower() in text:
            return "https://boardgamegeek.com" + href


def get_bgg_id_from_url(bgg_url: str) -> str:
    string_from_id = bgg_url.strip('https://boardgamegeek.com/boardgame/')
    game_id = string_from_id[:string_from_id.find('/')]
    return game_id


def direct_api(game_id: str) -> dict:
    sleep_time = 1
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0",
        "Authorization": f'Bearer {os.getenv('BGG_AUTHORIZATION')}'
    }

    url = f"https://boardgamegeek.com/xmlapi2/thing?id={game_id}&stats=1"

    resp = requests.get(url, headers=headers)
    if resp.status_code == 401:
        raise ConnectionError(f"Unauthorized to use BGG Api")
    elif resp.status_code in [500, 503]:
        logger.warning('Too many calls maybe!')
        sleep_time += 1

    sleep(sleep_time)
    xml_str = resp.text
    dict_xml_game = xmltodict.parse(xml_str)['items']['item']

    polished_dict_game = {
        ColumnNames.PLAYERS_MIN: dict_xml_game['minplayers']['@value'],
        ColumnNames.PLAYERS_MAX: dict_xml_game['maxplayers']['@value'],
        'duration_val': dict_xml_game['playingtime']['@value'],
        ColumnNames.YEAR: dict_xml_game['yearpublished']['@value'],
        ColumnNames.LINK_IMG: dict_xml_game['image']
    }

    return polished_dict_game


def update_game_df(df, column_names: ColumnNames | List[ColumnNames] = 'all') -> pd.DataFrame:
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

    def __update_game_info(row: pd.Series) -> pd.Series:
        game_info_dict = row[column_names].to_dict()

        # LINK BGG
        found_url = get_bgg_url(row[ColumnNames.TITLE])
        if not row[ColumnNames.LINK_BGG]:
            game_info_dict[ColumnNames.LINK_BGG] = found_url
        elif row[ColumnNames.LINK_BGG] == found_url:
            pass
        else:
            logger.warning(f'Differenti LinkBGG per {row[ColumnNames.TITLE]}')
            return row[column_names]

        game_id = get_bgg_id_from_url(found_url)
        new_info_dict = direct_api(game_id)

        common_keys = game_info_dict.keys() & new_info_dict.keys()
        updating_fields = {field_name: [game_info_dict[field_name], new_info_dict[field_name]] for field_name in common_keys
                           if '' != game_info_dict[field_name] != new_info_dict[field_name]}
        num_updating_fields = len(updating_fields)

        if num_updating_fields:
            logger.warning(f'Different fields for game {row[ColumnNames.TITLE]}\n'
                           f'Found URL was {found_url}\n'
                           f'{updating_fields}\n Not updating')
        else:
            game_info_dict.update(new_info_dict)

        return pd.Series(game_info_dict)

    df = df.iloc[30:32].copy()
    df[column_names] = df.apply(__update_game_info, axis=1)
    return df

