import click

from src import setup_logger
from src.geekinfo import BggUpdater


@click.command()
@click.option("--test", is_flag=True, default=False)
@click.option("--no-user-input", is_flag=False, default=False)
def main(test, no_user_input):
    """Main Function to update google sheet with new information"""

    logger = setup_logger('MAIN')
    logger.info('Starting...')

    if test:
        logger.info('Entered test mode')
        bgg_up = BggUpdater()

        for game_id in {'Seti': '418059',
                        'spirit': '162886',  # spirit
                        'terraM': '120677'}.values():
            bgg_up.call_and_format_api(game_id)
    else:
        bgg_up = BggUpdater(verbose=True)
        bgg_up.load_worksheet()
        bgg_up.update_games_and_upload(ask_for_input=not no_user_input)
        bgg_up.print_report()


if __name__ == "__main__":
    main()
