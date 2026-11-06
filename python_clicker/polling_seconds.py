"""Tutte le durate in secondi del monitor, in un posto solo.

Qui si regola il comportamento temporale dello script: niente di tutto questo
passa dalla riga di comando, si modifica questo file.

La cadenza di polling e' progressiva: da lontano si controlla di rado, piu' ci
si avvicina all'apertura piu' si stringe. Le soglie sono espresse come secondi
mancanti all'apertura, quindi negative dopo che l'orario e' passato.

    FAR_THRESHOLD        NEAR_THRESHOLD      0        HOT_WINDOW_END
    |                    |                   |        |
    +--- FAR_INTERVAL ---+-- NEAR_INTERVAL --+-- HOT_INTERVAL --+-- COOLDOWN --
    (oltre 10 min)       (10 min - 1 min)    (ultimo minuto e primi 20 dopo)
"""

from __future__ import annotations

FAR_THRESHOLD = 600.0
"""Oltre questi secondi dall'apertura si considera 'lontano'."""

NEAR_THRESHOLD = 60.0
"""Sotto questi secondi si entra nell'ultimo minuto: cadenza massima."""

HOT_WINDOW_END = -1200.0
"""Fine della finestra calda: 20 minuti dopo l'apertura si rallenta."""

FAR_INTERVAL = 30.0
"""Secondi fra due giri quando l'apertura e' lontana."""

NEAR_INTERVAL = 5.0
"""Secondi fra due giri nell'avvicinamento."""

HOT_INTERVAL = 0.5
"""Secondi fra due giri nel momento critico. E' il tempo di reazione minimo:
abbassarlo accorcia l'attesa ma moltiplica le richieste al sito."""

COOLDOWN_INTERVAL = 5.0
"""Secondi fra due giri quando la finestra calda e' passata senza esito."""

PANIC_OPEN_AFTER = 600.0
"""Secondi dopo l'apertura oltre i quali si apre comunque la pagina pubblica,
per non restare a fissare un terminale muto se il sito cambia struttura."""

REQUEST_TIMEOUT = 6.0
"""Secondi oltre i quali una singola richiesta viene abbandonata."""

CLOCK_RESYNC = 300.0
"""Secondi fra due riallineamenti dell'orologio sull'header HTTP `Date`."""

ALARM_MAX = 90.0
"""Durata massima dell'allarme sonoro, se non lo silenzi prima."""
