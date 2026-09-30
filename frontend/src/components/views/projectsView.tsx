import React from "react";

export default function ProjectsView({children}: { children: React.ReactNode }) {
    return <>
        {children}
        <section className="greenDD flex-o-center flex-col p-10 min-h-screen">
            <h2 className="m-6">Progetti</h2>
            <InCorporeSanoCard/>
        </section>
    </>;
}

function InCorporeSanoCard() {
    return <div className="max-w-2xl border border-white/30 rounded-lg p-8 bg-black/30">
        <h2>In Corpore Sano</h2>
        <h3 className="italic mb-4">Un gioco cooperativo e asimmetrico</h3>
        <p>
            In Corpore Sano è un gioco cooperativo completamente asimmetrico in cui i giocatori interpretano
            quattro apparati di un corpo umano. Riuscirete a vivere una vita felice fino alla terza età, o uno
            degli apparati rimarrà indietro e causerà la morte di tutti voi? Ognuno ha un compito ma dipende
            strettamente dai propri vicini. Agirete con parsimonia per non pesare sugli altri, o spingerete al
            massimo il vostro sistema incuranti dei costi altrui?
        </p>
        <div className="flex-o-center relative">
            <a target="_blank" rel="noopener noreferrer" href="/InCorporeSano">
                <div className="enlarge border m-4 p-4 relative nav-link rounded-lg">
                    Visita il sito di In Corpore Sano →
                </div>
            </a>
        </div>
    </div>;
}
