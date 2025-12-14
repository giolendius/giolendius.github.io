from google.oauth2.service_account import Credentials
import gspread
import pandas as pd
from logging import getLogger


logger = getLogger('GoogleSheet')


def access_spreadsheet():
    creds = Credentials.from_service_account_file(
        "secrets/modifica-service-account.secret.json",
        scopes=["https://www.googleapis.com/auth/spreadsheets"]
    )

    client = gspread.authorize(creds)
    _link = 'https://docs.google.com/spreadsheets/d/1RnaUmV5fSHc3oyIf62DhY3m21oLaS6xh2ss3KcMzKn8/edit?pli=1&gid=1973594395#gid=1973594395'
    # --- OPEN GOOGLE SHEET ---
    spreadsheet = client.open_by_url(_link)
    logger.info('Spreadsheet Loaded')

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


def upload_df_to_sheet(sheet: gspread.Worksheet, df: pd.DataFrame, start_row: int = 1, start_col: int = 1):
    """
    Upload a whole pandas DataFrame to a Google Sheet.

    Parameters
    ----------
    sheet : gspread.Worksheet
        Target Google Sheet worksheet.
    df : pd.DataFrame
        DataFrame to upload.
    start_row : int, optional
        Row index where the DataFrame should start (default is 1).
    start_col : int, optional
        Column index where the DataFrame should start (default is 1).
    """

    if not isinstance(df, pd.DataFrame):
        raise TypeError("df must be a pandas DataFrame")

    # Convert DataFrame to list of lists (include headers)
    values = [df.columns.tolist()] + df.values.tolist()

    # Calculate range
    end_row = start_row + len(values) - 1
    end_col = start_col + len(values[0]) - 1

    range_name = gspread.utils.rowcol_to_a1(start_row, start_col) + ":" + \
                 gspread.utils.rowcol_to_a1(end_row, end_col)
    range_name2 = gspread.utils.rowcol_to_a1(start_row, start_col)
    # Upload to Google Sheets
    sheet.update(range_name=range_name2, values=values)

