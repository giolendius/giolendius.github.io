// Automatic Slideshow - change image every 3 seconds

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
{   let tot = json["values"].length-1;
    console.log(tot)
    let bottone = document.getElementById("calcola");
    bottone.addEventListener("click", function () {
        animateValue(obj, 0, tot, 2000) });
        }

const obj = document.getElementById("tot_giochi");
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

fetch(sheetLink).then(response => response.json())
    .catch(error => console.error('Error fatching Google sheet:', error))
    .then(json => calcola_numero_giochi(json))




var myIndex = 0;
carousel();

function carousel() {
    var i;
    var x = document.getElementsByClassName("mySlides");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    myIndex++;
    if (myIndex > x.length) {
        myIndex = 1
    }
    x[myIndex - 1].style.display = "block";
    setTimeout(carousel, countdown_timeout);
}
