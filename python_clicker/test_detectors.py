"""Verifica dei rilevatori su HTML reale, prima chiuso e poi mutato come all'apertura."""

import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import polling_seconds as ps  # noqa: E402
from clickday_ideag import (  # noqa: E402
    GAME_DESIGNER_URL,
    REGISTRATION_URL,
    detect_password_lifted,
    detect_table_button,
    fetch,
    interval_for,
)

FORM_URL = "https://www.idea-g.it/2027-it/iscrizioni-game-designer-ideag/"

gd = fetch(GAME_DESIGNER_URL).html
reg = fetch(REGISTRATION_URL).html

failures: list[str] = []


def link_button(page: str, css_class: str, href: str) -> str:
    """Inietta un <a href> nel pulsante indicato, come fara' WordPress all'apertura."""
    pattern = re.compile(rf'(<p class="{css_class}">)(.*?)(</p>)', re.DOTALL)
    new_page, count = pattern.subn(rf'\1<a href="{href}">\2</a>\3', page, count=1)
    assert count == 1, f"pulsante {css_class} non trovato nell'HTML"
    return new_page


def expect(label: str, condition: bool, detail: str = "") -> None:
    print(f"{'OK  ' if condition else 'FAIL'}  {label}  {detail}")
    if not condition:
        failures.append(label)


# --- stato attuale: nessun falso positivo ---
expect("chiuso: pulsante non scatta", detect_table_button(gd, GAME_DESIGNER_URL) is None)
expect("chiuso: password non scatta", detect_password_lifted(reg, REGISTRATION_URL) is None)

# --- apertura simulata: il pulsante riceve l'href, come fara' WordPress ---
opened_gd = link_button(gd, "ideag-button-yellow", FORM_URL)
hit = detect_table_button(opened_gd, GAME_DESIGNER_URL)
expect("aperto: pulsante scatta", hit is not None, f"-> {hit.url if hit else ''}")
expect("aperto: URL corretto", bool(hit) and hit.url == FORM_URL)

# --- variante: href relativo, e il pulsante bianco linkato per primo ---
relative_gd = link_button(
    link_button(gd, "ideag-button-white", "/2027-it/senza-tavolo/"),
    "ideag-button-yellow",
    "/2027-it/iscrizioni-game-designer-ideag/",
)
hit_rel = detect_table_button(relative_gd, GAME_DESIGNER_URL)
expect(
    "aperto: href relativo risolto e pulsante giusto scelto",
    bool(hit_rel) and hit_rel.url == FORM_URL,
    f"-> {hit_rel.url if hit_rel else ''}",
)

# --- solo il pulsante bianco linkato: NON deve scattare ---
white_only = link_button(gd, "ideag-button-white", "/2027-it/senza-tavolo/")
expect("solo 'senza tavolo' linkato: non scatta", detect_table_button(white_only, GAME_DESIGNER_URL) is None)

# --- apertura simulata: la password viene rimossa ---
unlocked = reg.replace(" post-password-required", "")
start = unlocked.find('<form action="https://www.idea-g.it/wp-login.php?action=postpass"')
end = unlocked.find("</form>", start) + len("</form>")
unlocked = unlocked[:start] + "<p>Scegli il tuo tavolo</p>" + unlocked[end:]
assert "post-password" not in unlocked, "residui di protezione nell'HTML simulato"
hit_pw = detect_password_lifted(unlocked, REGISTRATION_URL)
expect("aperto: password rimossa scatta", hit_pw is not None, f"-> {hit_pw.url if hit_pw else ''}")

# --- pagina rotta: non deve scattare ---
expect("pagina vuota/errore: non scatta", detect_password_lifted("<html><body>502</body></html>", REGISTRATION_URL) is None)

# --- cadenza di polling: ogni finestra pesca la costante giusta ---
expect("cadenza: apertura lontana", interval_for(3600.0) == ps.FAR_INTERVAL)
expect("cadenza: avvicinamento", interval_for(300.0) == ps.NEAR_INTERVAL)
expect("cadenza: ultimo minuto", interval_for(10.0) == ps.HOT_INTERVAL)
expect("cadenza: appena dopo T", interval_for(-5.0) == ps.HOT_INTERVAL)
expect("cadenza: finestra calda esaurita", interval_for(-3600.0) == ps.COOLDOWN_INTERVAL)
expect(
    "soglie coerenti (lontano > vicino > fine finestra calda)",
    ps.FAR_THRESHOLD > ps.NEAR_THRESHOLD > 0 > ps.HOT_WINDOW_END,
)

print()
print("TUTTI I TEST PASSATI" if not failures else f"FALLITI: {failures}")
sys.exit(1 if failures else 0)
