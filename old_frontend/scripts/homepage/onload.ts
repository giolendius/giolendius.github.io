// import {Response} from "../../utils/types";
// import {env, keys} from "../../utils/constants";
//
//
// function animateValue(obj: HTMLElement, start: number, end: number, duration: number) {
//     let startTimestamp: number | null = null;
//     const step = (timestamp: number) => {
//         if (!startTimestamp) {
//             startTimestamp = timestamp
//         }
//         const progress: number = Math.min((timestamp - startTimestamp) / duration, 1);
//         obj.innerText = Math.floor(progress * (end - start) + start).toString();
//         if (progress < 1) {
//             window.requestAnimationFrame(step);
//         }
//     };
//     window.requestAnimationFrame(step);
// }
//
// function calcola_numero_giochi(json: Response) {
//     const obj: HTMLElement | null = document.getElementById("tot_giochi");
//     if (!obj) throw new Error("Elemento 'tot_giochi' non trovato");
//
//     let tot: number = json["values"].length - 1;
//
//     let bottone = document.getElementById("calcola");
//     if (bottone) {
//         bottone.addEventListener("click", function () {
//             animateValue(obj, 0, tot, 2000)
//         });
//     }
// }
//
//
// export function load_game_counter() {
//     let chiave = keys[env];
//     let schl = {
//         "dev": "1WgYYSWL6uOdjfEGFeQ",
//         "prod": "Zw6N3_JFjwqPsMt41c",
//         "prod2": "g2eGJy8CEaahauw"
//     }
//     let sheetLink: string = "https://sheets.googleapis.com/v4/spreadsheets/" +
//         "1RnaUmV5fSHc3oyIf62DhY3m21oLaS6xh2ss3KcMzKn8" +
//         // "1YuvMg055gT-pA0brzaKnK9PJqH8Z0bGdPez79sdWR8c" +
//         "/values/" +
//         "Database" +
//         "/?key=AIzaSyC" + chiave + schl[env];
//     console.log("fetching")
//     fetch(sheetLink).then(response => response.json())
//         .catch(error => console.error('Error fatching Google sheet:', error))
//         .then((json: Response) => calcola_numero_giochi(json))
// }