import click


from src.geekinfo import BggUpdater
from src import setup_logger


@click.command()
@click.option("--test", is_flag=True, default=False)
def main(test):
    """Main Function to update google sheet with new information"""

    logger = setup_logger('MAIN', True)
    logger.info('Starting...')

    if test:
        logger.info('Entered test mode')
        game_id = '418059' #seti
        bggu = BggUpdater()
        bggu.direct_api(game_id)
        game_id = '120677' #TerraMystica
    else:
        bggu = BggUpdater(verbose=True)
        bggu.load_worksheet()
        bggu.update_games_and_upload(ask_for_input=True)


if __name__ == "__main__":
    main()
