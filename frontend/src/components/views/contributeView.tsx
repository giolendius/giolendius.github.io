import React from "react";
import {NewNavbar} from "../navbar";
import {setPageT} from "./views";

export default function ContributeView({setPage}: {setPage: setPageT}) {
    return <>
        <NewNavbar setPage={setPage} activeLinkName={'contribute'}/>
        <GoooleSheet/>
        <GitHub/>
        <Spunti/>
    </>;
}

function GoooleSheet() {
    return <section className="h-1vh my-flex-wrap greenD mb-lg-5">
        <div className="m-10">
            <div className="didascalia-immagine">
                <h2 className="m-6">Manca un gioco?</h2>
                <p>Pensi che un gioco non sia nella lista?</p>
                <p>Accedi al foglio di
                    Google Sheets per inserirne i dati nella tabella e averlo instantaneamente qui.</p>
                <div className="flex-o-center">
                    <a target="_blank"
                       href="https://docs.google.com/spreadsheets/d/1RnaUmV5fSHc3oyIf62DhY3m21oLaS6xh2ss3KcMzKn8/edit?gid=1973594395#gid=1973594395">
                        <div className="border m-4 p-4 relative nav-link rounded-lg">Google Sheet</div>
                    </a>
                </div>
                <p> Inserisci almeno le informazioni essenziali come nome e giocatori minimi e massimi</p>
            </div>
        </div>
        <div className="m-10 flex-o-center h-full overflow-hidden">
            <img className='fittare' alt="Punto di Domanda"
                 src="https://img.freepik.com/premium-photo/close-up-green-plant-against-white-background_1048944-1056718.jpg?w=826"/>
        </div>
    </section>
}

function GitHub() {
    return <section className="h-vh-2 flex-o-center greenDD">
        <div>
            <h2>Guarda il codice!</h2>
            <p>Vuoi vedere il codice sorgente di questo sito? Trovi il codice su github:</p>
            <div className="flex-o-center relative">
                <a target="_blank" rel="noopener noreferrer"
                   href="https://github.com/giolendius/giolendius.github.io">
                    <div className="enlarge border m-4 p-4 relative nav-link rounded-lg">Repository</div>
                </a>
            </div>
            <p>Accedi alla pagina e visualizza il codice sul branch main!</p>
            <p></p>
        </div>
    </section>
}

function Spunti() {
    return <section className="h-vh-2 flex-o-center bg-black">
        <div>
            <h3>Suggerimenti su futuri miglioramenti</h3>
            <p>Ricerca avanzata: tipologie, autori...</p>
            <p>Pagina con visuale dettagliata del gioco</p>
            <p> Sviluppare le espansioni</p>
        </div>
        <div>
            <h3>Ultimi aggiornamenti</h3>
            <p>Game DB: 2024-12-22</p>
            <p>Site layout: 2025-12-11</p>
        </div>
    </section>
}