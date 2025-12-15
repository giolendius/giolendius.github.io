import click


from src.geekinfo import BggUpdater
from src import setup_logger


@click.command()
@click.option("--test", is_flag=True, default=False)
def main(test):
    """Main Function to update google sheet with new information"""

    logger = setup_logger('MAIN')
    logger.info('Starting...')

    if test:
        logger.info('Entered test mode')
        seti_id = '418059'
        BggUpdater().direct_api(seti_id)
    else:
        bggu = BggUpdater()
        bggu.update_games_and_upload()


if __name__ == "__main__":
    main()
