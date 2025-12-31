import React from 'react';
import {setPageT} from "../views"
import {ArrowToSlide, DotToSlide} from "./slideshow";
import meeple from "../../../img/3d-meeple-svgrepo-com.svg";
import {getElementById} from "../../utils/utils";
import {dataframe} from "../tableView/createDb";


export default function HomeView({children, setPage, promiseDb}:
                                 {
                                     children: React.ReactNode,
                                     setPage: setPageT,
                                     promiseDb: Promise<dataframe>
                                 }) {
    function BarrageBehind() {
        return <div id="barrage-behind" className="parallax-container flex-o-center">
            <div className="parallax-image"></div>
            <div className="w-80 z-3 bg-[#1e2d24D0] p-10 rounded-2xl flex-v-center">
                <h1 className="text-2xl p-4 font-bold text-[#bd5909] m-4">Ma stasera a che si gioca?</h1>
                <p>Che tu cerchi un veloce Party Game o un cinghialone che duri tutta la sera, qui puoi trovare
                    ispirazione.</p>
                <p>Vai alla sezione Ricerca e trova il più adatto a te!</p>
                <div className="mybutton"><a onClick={() => {
                    setPage('table')
                }}>Ricerca</a></div>
            </div>
        </div>

    }

    return <div>
        <MeepleCover/>
        {children}
        <BarrageBehind/>
        <QuantiSono promiseDb={promiseDb}/>
        <Slideshow/>
    </div>
}


function MeepleCover() {
    return <div id="cover" className="greenD">
        <section className="h-1vh flex-o-center">
            <div className="my-flex-wrap">
                <div className="meeple">
                    <img id="meeple" className=""
                         src={meeple} alt="meeple"/>
                </div>
                <h1 className="text-8xl pb-2 font-bold text-[#b7e4c7] m-4">Great Gallo Games</h1>
            </div>
        </section>
    </div>
}


function QuantiSono({promiseDb}: { promiseDb: Promise<dataframe> }) {
    const [flipped, setFlipped] = React.useState<boolean>(false)


    function animateValue(obj: HTMLElement, start: number, end: number, duration: number) {
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
            if (!startTimestamp) {
                startTimestamp = timestamp
            }
            const progress: number = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerText = Math.floor(progress * (end - start) + start).toString();
            if (progress < 1) {window.requestAnimationFrame(step)}
        };
        window.requestAnimationFrame(step);
    }

    async function calcola_numero_giochi() {

        const dfGames: dataframe = await promiseDb;
        const tot_games: number = dfGames.shape[0] - 1;
        const obj: HTMLElement = getElementById("tot_giochi");
        animateValue(obj, 0, tot_games, 2000)
    }

    return <section id="quanti-sono" className="greenDDD my-flex-wrap h-1vh">
        <div className="flex-v-center mt-8">
            {/*<div className="w-80">*/}
            <div style={{width: '80%'}}>
                <h2> Ma quanti sono?</h2>
                <p>Quanti giochi abbiamo al momento? Possiamo fare un calcolo provvisorio, senza distinguere tra giochi
                    indipendenti ed espansioni... Ci sono i giochi dei nostri genitori, alcuni giochi con versioni
                    multiple
                    molto simili tra loro... Però se proprio vuoi sapere un numero, al momento abbiamo informazioni nel
                    nostro database riguardo a.....</p>
            </div>
        </div>
        <div className="flex-o-center card-container">
            <div className={`card ${flipped ? 'flipped' : ''}`} onClick={() => {
                setFlipped(true)
            }}>
                <div className="card-front enlarge">
                    <img //style="height:100%; max-width: unset"
                        src="https://brandonthegamedev.com/wp-content/uploads/2017/09/Thirsty-Meeples-Shelfie-1024x681.jpg"
                        alt="Scaffale di giochi da tavolo"/>
                </div>
                <div className="card-back flex-v-center">
                    <button onClick={() => calcola_numero_giochi()} className="mybutton">Calcola<span> !!! </span>
                    </button>
                    <p></p>
                    <h2 id="tot_giochi">??</h2>
                </div>
            </div>
        </div>
    </section>
}


function Slideshow() {
    return <div className="slideshow">
        <button className="arrow" onClick={() => {
            ArrowToSlide(-1)
        }}>&#10094;</button>

        <div className="slides">
            <div className="slide active flex-v-center">
                <p>"We don’t stop playing because we grow old; We grow old because we stop playing."</p>
                <h4>George Bernard Shaw</h4>
            </div>
            <div className="slide to-right flex-v-center">
                <p>Quando il gioco si fa duro, i duri cominciano a giocare</p>
                <h4>John Belushi</h4>
            </div>
            <div className="slide flex-v-center">
                <p>"The goal is to win, but it is the goal that is important, not the winning." </p>
                <h4>Reiner Knizia</h4>
            </div>
            <div className="slide flex-v-center">
                <p>GG, well played</p>
                <p>Serio, non sapevo che scrivere</p>
                <h4>Me</h4>
            </div>
        </div>
        <button className="arrow right" onClick={() => {
            ArrowToSlide(1)
        }}>&#10095;</button>
        <div className="dots">
            <span className="dot active" onClick={() => {
                DotToSlide(0)
            }}></span>
            <span className="dot" onClick={() => {
                DotToSlide(1)
            }}></span>
            <span className="dot" onClick={() => {
                DotToSlide(2)
            }}></span>
            <span className="dot" onClick={() => {
                DotToSlide(3)
            }}></span>
        </div>
    </div>
}