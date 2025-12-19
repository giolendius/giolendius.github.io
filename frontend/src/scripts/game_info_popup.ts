import {getElementById} from "../utils/view.utils";

// Hide the information windows
function closeInfoModal() {
  const modal = getElementById('popup-blur');
  modal.classList.add('opacity-0', 'pointer-events-none');

  // Optional: animate the inner div
  const modalContent  = getElementById('popup-outer');
  modalContent.classList.remove('scale-100');
  modalContent.classList.add('scale-85');
}


//Populate and show the information windows
function showInfoModal(game) {
    console.log(game)
    // show
    const popup_blur = document.getElementById('popup-blur');
    popup_blur.classList.remove('opacity-0', 'pointer-events-none');
    // show with style
    const modalContent  = document.getElementById('popup-outer');
    modalContent.classList.remove('scale-85');
    modalContent.classList.add('scale-100');

    const div = document.getElementById('popup-inner');
    div.innerHTML = ''; // Clear previous

    // Image
    const img = document.createElement('img');
    img.src = game.LinkImmagine;
    img.alt = " "//game.Titolo || 'Game Image';
    img.className = "mx-auto mb-4 rounded-lg shadow-lg w-auto max-h-48 md:max-h-80 object-cover";
    div.appendChild(img);

    // Title
    const title = document.createElement('h2');
    title.textContent = game.Titolo;
    title.className = "text-3xl font-bold text-center mb-4 text-[#95d5b2]";
    div.appendChild(title);

    // Info container
    const info = document.createElement('div');
    info.className = "space-y-2 text-center text-base";

    const fields = [
        {label: "Giocatori", value: `${game["Gioc Min"]}–${game["Gioc Max"]}`},
        {label: "Giocatori (ottimo)", value: game["Gioc Best"]},
        {label: "Competizione", value: game.Competizione},
        {label: "Difficoltà", value: game.Difficoltà},
        {label: "Durata", value: game.Durata},
        {label: "Autori", value: game.Autori},
        {label: "Editore", value: game["Casa Editrice"]},
        {label: "Anno", value: game.Anno},
        {label: "Anno di arrivo da noi", value: game["Anno di arrivo da noi"]},
        {label: "Generi", value: game.Tipologie},
        {label: "Posizione Attuale", value: game.Luogo},
        {label: "Numero Espansioni", value: game.NumeroEspansioni}
    ];

    // Insert fields only if value exists
    fields.forEach(field => {
        if (field.value) {
            const p = document.createElement('p');
            p.innerHTML = `<strong>${field.label}:</strong> ${field.value}`;
            info.appendChild(p);
        }

        if (field.label === "Durata") {
        const spacer = document.createElement('div');
        spacer.className = "py-8"; // ensures spacing above and below

        const hr = document.createElement('hr');
        hr.className = "border-t border-gray-400";

        spacer.appendChild(hr);
        info.appendChild(spacer);
        }
    });

    // Special: Link to BGG if available
    if (game.LinkBGG) {
        console.log('gamelinkavaillable')
        const bggLink = document.createElement('a');
        bggLink.href = game.LinkBGG;
        bggLink.target = "_blank";
        bggLink.rel = "noopener noreferrer";
        bggLink.className = "block text-center text-[#74c69d] underline hover:text-[#52b788] mt-4";
        bggLink.textContent = "View on BoardGameGeek";
        info.appendChild(bggLink);
    }

    div.appendChild(info);
}