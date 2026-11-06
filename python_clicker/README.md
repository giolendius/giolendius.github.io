# Clickday IDEAG 2027 — monitor apertura iscrizioni

Sorveglia la pagina delle iscrizioni Game Designer di [IDEAG 2027](https://www.idea-g.it/2027-it/game-designer/#partecipare)
e **apre il browser nell'istante in cui il link si attiva**, con allarme sonoro.

> Apertura prevista: **domenica 8 novembre 2026, ore 10:00** (ora italiana).

Lo script porta solo fino al form. I dati di registrazione e il pagamento li
inserisci tu a mano.

## Come funziona

Controlla due segnali indipendenti, e il primo che scatta vince:

| segnale | cosa osserva |
|---|---|
| `button_link` | il pulsante «PRENOTA UN TAVOLO» riceve un `<a href>` (oggi è testo inerte, spento via CSS). L'URL trovato è quello autoritativo: si apre quello, qualunque sia |
| `password_lifted` | la pagina [Registrazione Tavoli IDEAG 2027](https://www.idea-g.it/2027-it/iscrizioni-game-designer-ideag/), già pubblicata ma protetta da password WordPress, smette di esserlo |

Lo script **non tenta** di indovinare o forzare la password: rileva soltanto
quando la protezione viene rimossa.

Dettagli che contano:

- **cache-buster** su ogni richiesta — senza, una CDN potrebbe servirti per
  minuti la copia della pagina ancora chiusa;
- **orologio sincronizzato** sull'header HTTP `Date` del server, così il
  countdown non sfasa se il PC è avanti o indietro;
- **cadenza progressiva**: 30 s da lontano, 5 s nell'ultimo quarto d'ora, 1 s
  nell'ultimo minuto e subito dopo. Nel picco sono ~2 richieste al secondo in
  tutto: nessun flood;
- **non muore mai**: ogni errore di rete viene loggato e ignorato.

## Requisiti

Nessuno. Solo Python 3.11+ (sul tuo PC: `3.13.5`), **nessun pacchetto da installare**.

```
C:\Users\gioele.gallo\AppData\Local\Programs\Python\Python313\python.exe
```

## Uso

```powershell
$py = 'C:\Users\gioele.gallo\AppData\Local\Programs\Python\Python313\python.exe'
cd C:\Users\gioele.gallo\PycharmProjects\gg\python_clicker

# 1. Verifica che browser e beep funzionino (fallo PRIMA di domenica)
& $py clickday_ideag.py --self-test

# 2. Stato attuale dei due segnali, un giro e via
& $py clickday_ideag.py --check

# 3. Domenica mattina: lancia e lascia girare
& $py clickday_ideag.py
```

### Opzioni

| opzione | default | a cosa serve |
|---|---|---|
| `--open-at 'AAAA-MM-GG HH:MM'` | `2026-11-08 10:00` | orario previsto, per provare la sequenza |
| `--interval-floor SEC` | `1.0` | intervallo minimo fra due controlli |
| `--panic-open-after MIN` | `10` | se a T+MIN non è scattato nulla, apre comunque la pagina pubblica |
| `--check` | — | giro singolo diagnostico |
| `--self-test` | — | simula un'apertura adesso |

## Checklist di domenica

- [ ] **09:40** — disattiva sospensione e screensaver del PC
- [ ] rete stabile (meglio cavo che Wi-Fi)
- [ ] browser già aperto, con autofill pronto
- [ ] dati di registrazione in un `.txt` da copiare-incollare
- [ ] account PayPal già loggato in un'altra scheda
- [ ] **09:45** — `& $py clickday_ideag.py`
- [ ] alza il volume

Quando scatta: il browser si apre da solo, parte il beep, l'URL viene stampato
a schermo **e** salvato in `clickday_hit.txt` (rete di sicurezza se il browser
non partisse). Premi INVIO per silenziare l'allarme.

## Test

```powershell
& $py test_detectors.py
```

Scarica le pagine vere, verifica che a sito chiuso **non** ci siano falsi
positivi, poi muta l'HTML come farà WordPress all'apertura (href assoluto,
href relativo, solo il pulsante sbagliato linkato, password rimossa, pagina in
errore) e verifica che i rilevatori scattino o restino zitti come devono.
