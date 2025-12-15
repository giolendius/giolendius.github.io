import json
from pathlib import Path


from src import setup_logger

CONSTANTS_DIRECTORY = Path.cwd() / 'constants'


def generate_enum():
    """Generate a python Enum from the json file"""

    logger = setup_logger('GENERATE - ENUM')

    json_file_path = CONSTANTS_DIRECTORY / 'column_names.json'
    dict_columns = json.loads(json_file_path.read_bytes())

    logger.info('json loaded')
    python_enum_str = [
        '"""This is an auto generated file. Every change will be overwritten. Change the json file instead."""',
        'from enum import StrEnum',
        '\n',
        'class ColumnNames(StrEnum):']
    python_enum_str += [f"""    {key} = "{value}" """ for key, value in dict_columns.items()]
    python_enum_str += ['']
    enum_path = CONSTANTS_DIRECTORY / 'types.py'

    enum_path.write_text('\n'.join(python_enum_str), encoding='utf-8')
    logger.info(f'Enum generated successfully')


if __name__ == '__main__':
    generate_enum()
