import click

import pandas as pd

from src.googlesheet import access_spreadsheet, backup_sheet1_into_sheet2, upload_df_to_sheet
from src.geekinfo import update_game_df, direct_api
from src import setup_logger


@click.command()
@click.option("--test", is_flag=True, default=False)
def main(test):
    """Main Function to update google sheet with new information"""

    logger = setup_logger('MAIN')
    logger.info('start!')

    if test:
        logger.info('Entered test mode')
        seti_id = '418059'
        direct_api(seti_id)
    else:
        spreadsheet = access_spreadsheet()
        backup_sheet1_into_sheet2(spreadsheet)
        worksheet = spreadsheet.worksheet('Database')

        values = worksheet.get_all_values()
        df = pd.DataFrame(values[1:], columns=values[0])
        df = update_game_df(df)
        upload_df_to_sheet(worksheet, df)


if __name__ == "__main__":
    main()
