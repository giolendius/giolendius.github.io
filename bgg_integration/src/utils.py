import logging


def setup_logger(name: str = '', verbose=False) -> logging.Logger:
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(level=level,
                        format='%(asctime)s %(name)s - %(levelname)s %(message)s',
                        datefmt="%Y-%m-%d %H:%M:%S")

    logger = logging.getLogger(name)
    return logger


