from google.oauth2.service_account import Credentials
import gspread
import pandas as pd
from logging import getLogger

# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]

# The ID and range of a sample spreadsheet.
SAMPLE_SPREADSHEET_ID = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
SAMPLE_RANGE_NAME = "Class Data!A2:E"

logger = getLogger('GoogleSheet')


def access_spreadsheet():
    creds = Credentials.from_service_account_file(
        "modifica-service-account.secret.json",
        scopes=["https://www.googleapis.com/auth/spreadsheets"]
    )

    client = gspread.authorize(creds)
    _link = 'https://docs.google.com/spreadsheets/d/1RnaUmV5fSHc3oyIf62DhY3m21oLaS6xh2ss3KcMzKn8/edit?pli=1&gid=1973594395#gid=1973594395'
    # --- OPEN GOOGLE SHEET ---
    spreadsheet = client.open_by_url(_link)
    logger.info('Spreadsheet Loaded')
    backup_sheet1_into_sheet2(spreadsheet)
    return spreadsheet


def backup_sheet1_into_sheet2(spreadsheet):
    sheet1 = spreadsheet.worksheet("Database")  # source
    sheet2 = spreadsheet.worksheet("Copia di Database")
    data = sheet1.get_all_values()

    sheet2.clear()
    sheet2.update("A1", data)
    logger.info('BackUp Copy completed')


def update_column(sheet: gspread.Worksheet, values, col_name: str):
    """Update the Google sheet colum with the new values"""
    headers = sheet.row_values(1)
    try:
        col_index = headers.index('345') + 1
    except ValueError:
        raise f'Column {col_name} is not in the Google Sheet. Check the spelling.'

    if isinstance(values, pd.DataFrame):
        new_values = values[col_name].tolist()
        row_index = 2  # the index 1 is the header
    elif isinstance(values, list):
        new_values = values
        row_index = 1  # we suppose the row contains the header as first element
    else:
        raise TypeError('Type of values not recognised. Specify a dataframe or a list')

    sheet.update(
        range_name=gspread.utils.rowcol_to_a1(row_index, col_index),
        values=[[v] for v in new_values]
    )




