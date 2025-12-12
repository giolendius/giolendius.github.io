from bs4 import BeautifulSoup
from logging import getLogger
import pandas as pd
import requests
from typing import List
import os
from urllib.parse import quote_plus
import xmltodict

from .constants import Column

headers = {"User-Agent": "Mozilla/5.0"}
logger = getLogger('GEEK')


def get_boardgame_image_url(game_name):
    game_url = get_bgg_url(game_name)

    logger.info(f'Got url: {game_url}')
    html = get_complete_html_with_selenium(game_url)
    game_soup = BeautifulSoup(html, 'html.parser')

    game_div = game_soup.find("div", class_="game-header")

    # game_soup.find_all("p", class_="gameplay")

    # image_tag = game_soup.find("img", {"class": "game-header-image"})
    #
    # if not image_tag or not image_tag.get("src"):
    #     return f"No image found for {game_name}"

    path = "src/miooutput.html"
    html = game_div.prettify()
    print(html)
    # with open(path, "w", encoding="utf-8") as f:
    #     f.write("<!doctype html>\n")
    #     f.write(html)
    # logger.info('Html printed')
    return None  # image_tag["src"]


def direct_api():

    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:145.0) Gecko/20100101 Firefox/145.0",
        "Authorization": f'Bearer {os.getenv('BGG_AUTHORIZATION')}'
    }

    url = "https://api.geekdo.com/xmlapi2/thing?id=418059&stats=1"
    url2 = "https://boardgamegeek.com/xmlapi2/thing?id=418059&stats=1"
    resp = requests.get(url2, headers=headers)

    xml_str = resp.text
    dict_game = xmltodict.parse(xml_str)


def get_bgg_url(game_name: str):
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


def update_game_info(df, column_names: Column | List[Column]):
    def __update_game_info(row: pd.Series):
        info_dict = {}
        if Column.LINK in column_names:
            if not row[Column.LINK]:
                info_dict[Column.LINK] = get_bgg_url(row[Column.NAME])
        # info_dict['Luogo'] = 'ViaBologna'
        return pd.Series(info_dict)

    if isinstance(column_names, Column):
        column_names = [column_names]
    minidf = df.iloc[13:15]
    minidf[column_names] = minidf.apply(__update_game_info, axis=1)


boardgames = [

    "Civilization",
    "Cluedo conspiracy",
    "Cluedo Harry Potter",
    "Cluedo Portatile",
    "Co-mix",
    "Codice fantasma",
    "Coloretto",
    "Concept",
    "Corsari",
    "Crack",
    "Cranium",
    "Cross clues",
    "Cryptid",
    "Darwin's Journey",
    "Dead of winter",
    "Decrypto",
    "Detective - sulla scena del crimine",
    "Diceforge",
    "Dixit",
    "Dixit: disney",
    "Dobble"
]
