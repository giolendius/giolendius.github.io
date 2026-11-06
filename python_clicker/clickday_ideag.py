"""Monitor di apertura delle iscrizioni IDEAG 2027 (clickday: 8 novembre 2026, ore 10:00).

Sorveglia due segnali indipendenti e apre il browser sul primo che scatta:

1. il pulsante «PRENOTA UN TAVOLO» della pagina pubblica riceve un `<a href>`
   (oggi è testo inerte, disattivato via CSS);
2. la pagina «Registrazione Tavoli IDEAG 2027», già pubblicata ma protetta da
   password WordPress, smette di esserlo.

Lo script non tenta in alcun modo di indovinare o forzare la password: rileva
soltanto quando la protezione viene rimossa dagli organizzatori.
"""

from __future__ import annotations

import argparse
import html as html_module
import re
import sys
import threading
import time
import urllib.error
import urllib.request
import webbrowser
from collections.abc import Callable, Sequence
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
from datetime import datetime, timedelta, timezone, tzinfo
from email.utils import parsedate_to_datetime
from enum import StrEnum
from pathlib import Path
from urllib.parse import urljoin, urlparse, urlunparse
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

try:
    # stdlib ma presente solo su Windows: altrove si ricade sul bell ASCII.
    import winsound
except ImportError:
    winsound = None  # type: ignore[assignment]


Html = str


def _italian_timezone() -> tzinfo:
    """Fuso di Roma, con fallback a quello di sistema.

    Su Windows il tz database non c'è e `zoneinfo` fallisce senza il pacchetto
    `tzdata`: per restare a dipendenze zero si ripiega sul fuso locale, che su
    un PC italiano coincide con Europe/Rome.
    """
    try:
        return ZoneInfo("Europe/Rome")
    except ZoneInfoNotFoundError:
        return datetime.now().astimezone().tzinfo or timezone(timedelta(hours=1))


ROME = _italian_timezone()
DEFAULT_OPEN_AT = datetime(2026, 11, 8, 10, 0, tzinfo=ROME)

GAME_DESIGNER_URL = "https://www.idea-g.it/2027-it/game-designer/"
REGISTRATION_URL = "https://www.idea-g.it/2027-it/iscrizioni-game-designer-ideag/"

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
)
REQUEST_TIMEOUT = 6.0
CLOCK_RESYNC_SECONDS = 300.0
HIT_FILE = Path(__file__).with_name("clickday_hit.txt")

BUTTON_BLOCK = re.compile(
    r"<p[^>]*class=\"[^\"]*ideag-button[^\"]*\"[^>]*>(?P<body>.*?)</p>",
    re.IGNORECASE | re.DOTALL,
)
ANCHOR_HREF = re.compile(r"<a[^>]*\shref=[\"'](?P<href>[^\"']+)[\"']", re.IGNORECASE)
TAG = re.compile(r"<[^>]+>")
PASSWORD_MARKERS = ("post-password-required", "post-password-form")
PAGE_SANITY_MARKER = "entry-title"


class Signal(StrEnum):
    """Quale rilevatore ha fatto scattare l'apertura."""

    BUTTON_LINK = "button_link"
    PASSWORD_LIFTED = "password_lifted"


@dataclass(frozen=True)
class Hit:
    """Rilevazione dell'apertura, con l'URL da aprire nel browser."""

    signal: Signal
    url: str
    detected_at: datetime


@dataclass(frozen=True)
class FetchResult:
    html: Html
    server_time: datetime | None


Detector = Callable[[Html, str], Hit | None]


@dataclass(frozen=True)
class Probe:
    """Una pagina da sorvegliare, con il rilevatore che la interpreta."""

    name: str
    url: str
    detect: Detector


@dataclass
class Clock:
    """Orologio allineato all'header HTTP `Date`.

    Senza questo allineamento un PC avanti o indietro di qualche secondo
    farebbe accelerare il polling nel momento sbagliato. La precisione è
    dell'ordine del secondo (risoluzione dell'header più latenza di rete).
    """

    offset_seconds: float = 0.0
    last_sync_monotonic: float = field(default=float("-inf"))

    def sync(self, server_time: datetime | None) -> None:
        if server_time is None:
            return
        self.offset_seconds = server_time.timestamp() - time.time()
        self.last_sync_monotonic = time.monotonic()

    @property
    def needs_sync(self) -> bool:
        return time.monotonic() - self.last_sync_monotonic > CLOCK_RESYNC_SECONDS

    def now(self) -> datetime:
        return datetime.fromtimestamp(time.time() + self.offset_seconds, tz=ROME)


def log(message: str) -> None:
    print(f"[{datetime.now(ROME):%H:%M:%S}] {message}", flush=True)


def _plain_text(fragment: Html) -> str:
    return html_module.unescape(TAG.sub(" ", fragment))


def _with_cache_buster(url: str) -> str:
    """Aggiunge un parametro usa-e-getta per bypassare cache CDN e WordPress.

    Senza, dopo l'apertura rischieremmo di continuare a ricevere per minuti la
    copia in cache della pagina chiusa: è il punto più critico per non arrivare
    tardi.
    """
    parts = urlparse(url)
    prefix = f"{parts.query}&" if parts.query else ""
    return urlunparse(parts._replace(query=f"{prefix}_cb={time.time_ns()}"))


def _server_time(date_header: str | None) -> datetime | None:
    if not date_header:
        return None
    try:
        return parsedate_to_datetime(date_header)
    except (TypeError, ValueError):
        return None


def fetch(url: str) -> FetchResult | None:
    """Scarica la pagina. Restituisce None su qualunque errore, senza propagarlo."""
    request = urllib.request.Request(
        _with_cache_buster(url),
        headers={
            "User-Agent": USER_AGENT,
            "Cache-Control": "no-cache",
            "Pragma": "no-cache",
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "it-IT,it;q=0.9",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT) as response:
            body = response.read().decode("utf-8", errors="replace")
            return FetchResult(html=body, server_time=_server_time(response.headers.get("Date")))
    except (urllib.error.URLError, TimeoutError, OSError, ValueError) as error:
        log(f"richiesta fallita ({url}): {error}")
        return None


def detect_table_button(page: Html, url: str) -> Hit | None:
    """Scatta quando «PRENOTA UN TAVOLO» smette di essere testo inerte e riceve un link."""
    for block in BUTTON_BLOCK.finditer(page):
        body = block.group("body")
        if "prenota un tavolo" not in _plain_text(body).lower():
            continue
        for anchor in ANCHOR_HREF.finditer(body):
            href = anchor.group("href").strip()
            if href.startswith("#"):
                continue
            return Hit(
                signal=Signal.BUTTON_LINK,
                url=urljoin(url, html_module.unescape(href)),
                detected_at=datetime.now(ROME),
            )
    return None


def detect_password_lifted(page: Html, url: str) -> Hit | None:
    """Scatta quando la pagina di registrazione non è più protetta da password."""
    if any(marker in page for marker in PASSWORD_MARKERS):
        return None
    if PAGE_SANITY_MARKER not in page:
        # Pagina anomala (errore, manutenzione, redirect): meglio non scattare.
        return None
    return Hit(signal=Signal.PASSWORD_LIFTED, url=url, detected_at=datetime.now(ROME))


PROBES: Sequence[Probe] = (
    Probe("pulsante PRENOTA UN TAVOLO", GAME_DESIGNER_URL, detect_table_button),
    Probe("pagina Registrazione Tavoli", REGISTRATION_URL, detect_password_lifted),
)


def interval_for(seconds_to_open: float, floor: float) -> float:
    """Cadenza di polling in funzione della distanza dall'orario di apertura."""
    if seconds_to_open > 600:
        return 30.0
    if seconds_to_open > 60:
        return 5.0
    if seconds_to_open > -1200:
        return floor
    return max(floor, 5.0)


def sound_alarm(stop: threading.Event, max_seconds: float = 90.0) -> None:
    deadline = time.monotonic() + max_seconds
    while not stop.is_set() and time.monotonic() < deadline:
        if winsound is not None:
            winsound.Beep(1200, 350)
            winsound.Beep(880, 350)
        else:
            print("\a", end="", flush=True)
        stop.wait(0.2)


def handle_hit(hit: Hit) -> None:
    """Apre il browser, salva l'URL su file e suona l'allarme finché non lo silenzi."""
    banner = (
        "\n"
        "========================================================\n"
        "  ISCRIZIONI APERTE  --  VAI SUBITO\n"
        f"  segnale : {hit.signal}\n"
        f"  ora     : {hit.detected_at:%H:%M:%S.%f}\n"
        f"  URL     : {hit.url}\n"
        "========================================================\n"
    )
    print(banner, flush=True)

    if not webbrowser.open(hit.url):
        log("il browser non si è aperto da solo: copia l'URL qui sopra.")

    try:
        HIT_FILE.write_text(f"{hit.detected_at.isoformat()}\n{hit.url}\n", encoding="utf-8")
    except OSError as error:
        log(f"non sono riuscito a salvare {HIT_FILE.name}: {error}")

    stop = threading.Event()
    threading.Thread(target=sound_alarm, args=(stop,), daemon=True).start()
    try:
        input("Premi INVIO per silenziare l'allarme... ")
    except (EOFError, KeyboardInterrupt):
        pass
    stop.set()


def run_check() -> int:
    """Giro singolo diagnostico: mostra lo stato attuale dei due segnali."""
    exit_code = 0
    for probe in PROBES:
        result = fetch(probe.url)
        if result is None:
            print(f"  {probe.name}: IRRAGGIUNGIBILE")
            exit_code = 1
            continue
        hit = probe.detect(result.html, probe.url)
        state = f"APERTO -> {hit.url}" if hit else "non ancora"
        print(f"  {probe.name}: {state}  ({len(result.html)} byte, Date: {result.server_time})")
    return exit_code


def poll_once(pool: ThreadPoolExecutor, clock: Clock) -> list[Hit]:
    """Interroga tutte le pagine in parallelo: in sequenza il giro costerebbe il doppio."""
    results = list(pool.map(lambda probe: (probe, fetch(probe.url)), PROBES))
    hits: list[Hit] = []
    for probe, result in results:
        if result is None:
            continue
        if clock.needs_sync:
            clock.sync(result.server_time)
            log(f"orologio sincronizzato col server (scarto {clock.offset_seconds:+.1f} s)")
        hit = probe.detect(result.html, probe.url)
        if hit is not None:
            hits.append(hit)
    return hits


def watch(open_at: datetime, floor: float, panic_after_minutes: float) -> int:
    clock = Clock()
    panic_deadline = open_at + timedelta(minutes=panic_after_minutes)
    panicked = False
    pool = ThreadPoolExecutor(max_workers=len(PROBES))

    log(f"apertura attesa: {open_at:%d/%m/%Y %H:%M} ({open_at.tzname()})")
    log(f"sorveglio {len(PROBES)} pagine. Ctrl+C per fermare.")

    while True:
        round_started = time.monotonic()
        hits = poll_once(pool, clock)

        if hits:
            hits.sort(key=lambda candidate: 0 if candidate.signal is Signal.BUTTON_LINK else 1)
            handle_hit(hits[0])
            return 0

        now = clock.now()
        seconds_to_open = (open_at - now).total_seconds()

        if not panicked and now >= panic_deadline:
            panicked = True
            log("nessun segnale rilevato dopo l'orario previsto: apro comunque la pagina pubblica.")
            webbrowser.open(GAME_DESIGNER_URL)

        delay = interval_for(seconds_to_open, floor)
        countdown = timedelta(seconds=round(abs(seconds_to_open)))
        verso = "mancano" if seconds_to_open > 0 else "trascorsi da T"
        print(
            f"[{now:%H:%M:%S}] chiuso -- {verso} {countdown} -- ricontrollo fra {delay:.0f}s   ",
            end="\r" if delay <= 5 else "\n",
            flush=True,
        )
        # Scala il tempo gia' speso a scaricare, altrimenti la cadenza reale slitta.
        time.sleep(max(0.0, delay - (time.monotonic() - round_started)))


def parse_open_at(value: str) -> datetime:
    try:
        return datetime.strptime(value, "%Y-%m-%d %H:%M").replace(tzinfo=ROME)
    except ValueError as error:
        raise argparse.ArgumentTypeError(f"formato atteso 'AAAA-MM-GG HH:MM' ({error})") from error


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Monitor del clickday iscrizioni IDEAG 2027.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument(
        "--open-at",
        type=parse_open_at,
        default=DEFAULT_OPEN_AT,
        metavar="'AAAA-MM-GG HH:MM'",
        help="orario di apertura previsto (ora italiana)",
    )
    parser.add_argument(
        "--interval-floor",
        type=float,
        default=1.0,
        metavar="SEC",
        help="intervallo minimo fra due controlli della stessa pagina",
    )
    parser.add_argument(
        "--panic-open-after",
        type=float,
        default=10.0,
        metavar="MIN",
        help="minuti dopo l'apertura oltre i quali apre comunque la pagina pubblica",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="giro singolo diagnostico: stampa lo stato dei segnali ed esce",
    )
    parser.add_argument(
        "--self-test",
        action="store_true",
        help="simula un'apertura adesso, per verificare browser e allarme sonoro",
    )
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    args = build_parser().parse_args(argv)

    if args.check:
        return run_check()

    if args.self_test:
        log("self-test: simulo l'apertura. Devi sentire i beep e vedere il browser.")
        handle_hit(
            Hit(signal=Signal.BUTTON_LINK, url=GAME_DESIGNER_URL, detected_at=datetime.now(ROME))
        )
        return 0

    try:
        return watch(args.open_at, args.interval_floor, args.panic_open_after)
    except KeyboardInterrupt:
        print()
        log("interrotto.")
        return 130


if __name__ == "__main__":
    sys.exit(main())
