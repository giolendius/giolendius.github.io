import logging

blue = "\x1b[34;40m"
green =  "\x1b[32;40m"
yellow = "\x1b[33;40m"
blac_on_yellow = "\x1b[30;43m"
black_on_green = "\x1b[30;42m"
white_on_red = "\x1b[;41m"
bold_red = "\x1b[31;1m"
reset = "\x1b[0m"

class BGGFormatter(logging.Formatter):

    grey = "\x1b[38;20m"
    red = "\x1b[31;20m"

    format = "        %(name)s - %(message)s " #+ "(%(filename)s:%(lineno)d)"
    # LEVEL here have no meaning
    FORMATS = {
        logging.DEBUG: logging.Formatter(blue + format + reset),
        logging.INFO: logging.Formatter(green + format + reset),
        logging.WARNING: logging.Formatter(black_on_green + format + reset),
        logging.ERROR: logging.Formatter(blac_on_yellow + format + reset),
        logging.CRITICAL: logging.Formatter(white_on_red + format + reset)
    }

    def format(self, record):
        # log_fmt = self.FORMATS.get(record.levelno)
        # formatter = logging.Formatter(log_fmt)
        formatter = self.FORMATS.get(record.levelno)
        return formatter.format(record)


class ClassicFormatter(logging.Formatter):
    def __init__(self):
        super().__init__('%(asctime)s %(name)s - %(levelname)s %(message)s', datefmt='%Y-%m-%d %H:%M:%S')

    # def format(self, record):
    #     return super().format(record)


class TestFormatter(logging.Formatter):
    prova_color = ''
    format = "        %(name)s - %(message)s " #+ "(%(filename)s:%(lineno)d)"
    my_formatter = logging.Formatter(prova_color + format + reset)

    def format(self, record):
        return self.my_formatter.format(record)


def setup_logger(name: str = '', verbose=False, format_to_use = 0) -> logging.Logger:

    logger = logging.getLogger(name)
    level = logging.DEBUG if verbose else logging.INFO
    logger.setLevel(level)

    if logger.hasHandlers():
        # remove previous handlers
        logger.handlers.clear()

    if format_to_use == 0:
        ch = logging.StreamHandler()
        ch.setFormatter(ClassicFormatter())
        logger.addHandler(ch)
        # Standard formatter
        # logging.basicConfig(format='%(asctime)s %(name)s - %(levelname)s %(message)s',
        #                                          datefmt="%Y-%m-%d %H:%M:%S")
    elif format_to_use == 1:
        ch = logging.StreamHandler()
        ch.setFormatter(BGGFormatter())
        logger.addHandler(ch)
        # each time you add a handler, you will get one more duplicated message out!

        # logger.debug("debug message")
        # logger.info("info message")
        # logger.warning("warning message")
        # logger.error("error message")
        # logger.critical("critical message")

    return logger

def prova_colori():

    for mycolor in ["\x1b[1;41m", "\x1b[1;20m", "\x1b[30;42m", "\x1b[1;35;47m"]:
        logger = logging.getLogger(mycolor)
        logger.setLevel(logging.DEBUG)

        prova_color = mycolor
        ch = logging.StreamHandler()
        ch.setFormatter(TestFormatter())
        logger.addHandler(ch)
        # each time you add a handler, you will get one more duplicated message out!

        logger.debug("debug message")
        # logger.info("info message")
        # logger.warning("warning message")
        # logger.error("error message")
        logger.critical("critical message")


if __name__ == '__main__':
    global prova_color
    prova_colori()