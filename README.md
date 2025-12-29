# giolendius.github.io

<style>
body {
    font-size: 150% !important
    color: green;
}
p {
font-size: 100%
}



h1, h2 {
    font-size: 250% !important;
    color: red;
}



</style>

This is the repository for the webpage of the games we own.

In the ``frontend`` sub-folder you'll find the code for the creation of the GitHubPage 
<a href="http://giolendius.github.io">Great Gallo Games.</a>. Since the is no option for a backend, 
we do not have one. This means that the site database is implemented as a simple, accessible google sheets 
linked in the webpage.

In the sub-folder ``bgg_integration`` there is a python script, executable locally to retrieve and integrate google_sheet 
information with the statistics provided by BGG 
<a href="http://boardgamegeek.com">BGG</a>. 


"We don’t stop playing because we grow old; We grow old because we stop playing."


_______

## How To GoogleApi

Go to https://console.cloud.google.com/welcome?project=progettogiochi

### Service Account

Dalla pagina https://console.cloud.google.com/, vai sul menù in alto a sinistra, e seleziona API e 
Servizi -| Credenziali. Crea Credenziali -| Service Account, e crea.

Dalla pagina https://console.cloud.google.com/, vai sul menù in alto a sinistra, e seleziona 
IAM e Amministrazione -> Service Account e seleziona l'account creato. 
Vai sul Tab chiavi, 