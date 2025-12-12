import click
import logging

import pandas as pd

from src.googlesheet import access_spreadsheet, update_column
from src.constants import Column
from src.geekinfo import update_game_info, direct_api


@click.command()
@click.option("--test", is_flag=True, default=False)
def main(test):
    """Main Function to update google sheet with new information"""
    logging.basicConfig(level = logging.INFO,
                        format='%(asctime)s %(name)s - %(levelname)s %(message)s',
                        datefmt="%Y-%m-%d %H:%M:%S")
    logger = logging.getLogger('MAIN')

    if test:
        from src.geekinfo import get_boardgame_image_url
        logger.info('Entered test mode')
        direct_api()
        for game in ['SETI: search for', "Cryptid", "Dixit"]:
            print(f"{game}: {get_boardgame_image_url(game)}")
    else:
        spreadsheet = access_spreadsheet()
        sheet = spreadsheet.worksheet('Database')

        values = sheet.get_all_values()
        df = pd.DataFrame(values[1:], columns=values[0])

        update_game_info(df, Column.LINK)


if __name__ == "__main__":
    main()
