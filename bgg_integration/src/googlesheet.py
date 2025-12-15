from google.oauth2.service_account import Credentials
import gspread
import pandas as pd

from . import setup_logger


class GoogleSheetLoader:
    def __init__(self):
        self.logger = setup_logger('GoogleSheet')
        spreadsheet = self.access_spreadsheet()
        self.backup_sheet1_into_sheet2(spreadsheet)
        self.worksheet = spreadsheet.worksheet('Database')

    def access_spreadsheet(self):
        creds = Credentials.from_service_account_file(
            "secrets/modifica-service-account.secret.json",
            scopes=["https://www.googleapis.com/auth/spreadsheets"]
        )

        client = gspread.authorize(creds)
        _link = (f'https://docs.google.com/spreadsheets/d/1RnaUmV5fSHc3oyI'
                 f'f62DhY3m21oLaS6xh2ss3KcMzKn8/edit?pli=1&gid=1973594395#gid=1973594395')
        # --- OPEN GOOGLE SHEET ---
        spreadsheet = client.open_by_url(_link)
        self.logger.info('Successfully accessed spreadsheet')
        return spreadsheet

    def backup_sheet1_into_sheet2(self, spreadsheet):
        sheet1 = spreadsheet.worksheet("Database")  # source
        sheet2 = spreadsheet.worksheet("Copia di Database")
        data = sheet1.get_all_values()

        sheet2.clear()
        sheet2.update("A1", data)
        self.logger.info('BackUp Copy completed')

    def get_dataframe(self) -> pd.DataFrame:
        values = self.worksheet.get_all_values()
        return pd.DataFrame(values[1:], columns=values[0])

    def upload_df(self, df: pd.DataFrame, start_row: int = 1, start_col: int = 1):
        """
        Upload a whole pandas DataFrame to a Google Sheet.
        :param df: Pandas DataFrame to upload
        :param start_row: The starting row in the Google Sheet (1-indexed)
        :param start_col: The starting column in the Google Sheet (1-indexed)        :
        """

        self.logger.info('Uploading updated sheet')
        if not isinstance(df, pd.DataFrame):
            raise TypeError("df must be a pandas DataFrame")

        # Convert DataFrame to list of lists (include headers)
        values = [df.columns.tolist()] + df.values.tolist()

        # Calculate range
        # end_row = start_row + len(values) - 1
        # end_col = start_col + len(values[0]) - 1

        range_name = gspread.utils.rowcol_to_a1(start_row, start_col)
        self.worksheet.update(range_name=range_name, values=values)
        self.logger.info('Upload done')

    def update_column(self, values, col_name: str):
        """Update the Google sheet colum with the new values"""
        headers = self.worksheet.row_values(1)
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

        self.worksheet.update(
            range_name=gspread.utils.rowcol_to_a1(row_index, col_index),
            values=[[v] for v in new_values]
        )
