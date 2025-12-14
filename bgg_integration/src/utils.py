import logging


def setup_logger(name: str = '') -> logging.Logger:
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s %(name)s - %(levelname)s %(message)s',
                        datefmt="%Y-%m-%d %H:%M:%S")

    logger = logging.getLogger(name)
    return logger


