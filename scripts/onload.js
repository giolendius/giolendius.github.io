// import { NavLinkName} from "./types";
function createNav(activeLinkName) {
    const headerHTML = `
<!--<base href="gg">-->
        <div class="bg-black px-4 py-6 my-flex-wrap switch">
          <div class="backdrop-blur-md rounded-lg border border-white/30 flex m-8">
                <a id="link-home" href="/index.html"
                   class="rounded-l-lg nav-link px-4 py-2 text-white text-lg relative transition duration-300"> Home</a>
                <a id="link-table" href="/html/table.html"
                   class="nav-link px-4 py-2 text-white text-lg relative transition duration-300"> Cerca </a>
                <a id="link-contribuisci" href="/html/modify_source.html"
                   class="rounded-r-lg nav-link px-4 py-2 text-white text-lg relative transition duration-300"> Contribuisci </a>
            </div>
            <div class="flex items-center bg-[#1e2d24] rounded-full p-2 m-4 border-2 border-[#b7e4c7]">
                <div class="bg-[#b7e4c7] ml-auto mr-2 rounded-full p-1">
                <img id="meeple" src="../img/3d-meeple-svgrepo-com.svg" alt="meeple"
                                                                             class="w-12"></div>
                <h1 class="text-4xl pb-2 font-bold text-[#b7e4c7]">Great Gallo Games</h1>
            </div>
        
        </div>`;
    document.write(headerHTML);
    const activeLink = document.getElementById(activeLinkName);
    if (activeLink) {
        activeLink.classList.add("active");
    }
}

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

function calcola_numero_giochi(json)
{   const obj = document.getElementById("tot_giochi");
    let tot = json["values"].length-1;
    console.log(tot)
    let bottone = document.getElementById("calcola");
    bottone.addEventListener("click", function () {
        animateValue(obj, 0, tot, 2000) });
        }


function load_game_counter() {

let chiave = keys[env]
let schl = {
    "dev": "1WgYYSWL6uOdjfEGFeQ",
    "prod": "Zw6N3_JFjwqPsMt41c",
    "prod2": "g2eGJy8CEaahauw"
}
let sheetLink = "https://sheets.googleapis.com/v4/spreadsheets/" +
    "1RnaUmV5fSHc3oyIf62DhY3m21oLaS6xh2ss3KcMzKn8" +
    // "1YuvMg055gT-pA0brzaKnK9PJqH8Z0bGdPez79sdWR8c" +
    "/values/" +
    "Database" +
    "/?key=AIzaSyC" + chiave + schl[env];
console.log("fetching")
fetch(sheetLink).then(response => response.json())
    .catch(error => console.error('Error fatching Google sheet:', error))
    .then(json => calcola_numero_giochi(json))
}
load_game_counter()