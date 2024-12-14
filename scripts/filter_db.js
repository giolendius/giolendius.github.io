let chiave = keys[env]
let sheetLink = "https://sheets.googleapis.com/v4/spreadsheets/" +
    "1YuvMg055gT-pA0brzaKnK9PJqH8Z0bGdPez79sdWR8c" +
    "/values/" +
    "ElencoGiochiDatabase" +
    "/?key=" + chiave;
fetch(sheetLink).then(response => response.json())
    .then(json => console.log(json["values"])).catch(error => console.error('Error fatching Google sheet:', error))



let array_dati = gioele();
let dati_filtrati = create_db_and_filter(array_dati);



tabella_giochi = document.getElementById("tabella_giochi");
creaTabella(dati_filtrati);


function create_db_and_filter(array_dati) {
    let df = new dfd.DataFrame(array_dati);
    df.rename({0: "name", 1: "compet", 2: "players"}, {inplace: true});

    let placeholder = "";
    let placeholder2 = ""
    let cond1 = df["compet"].eq(placeholder).or(placeholder == "");
    let cond2 = df["players"].eq(placeholder2).or(placeholder2 == "");
    return df.query((cond1).and(cond2)).values;
}

function creaTabella(array){
    let tablebody = document.createElement("tbody");
    tabella_giochi.appendChild(tablebody);

    array.forEach(function (rowData) {
        let row_div = document.createElement("tr");
        tablebody.appendChild(row_div);
        // row_div.className = "flex flex-wrap rounded-lg w-full m-10";
        // row_div.style = "background-color: blue; display: flex;";
        rowData.forEach(function (cellData) {
            let cell = document.createElement("td");
            row_div.appendChild(cell);
            // cell.className = "px-6 m-20";
            // console.log("colonna is", colonna, "i is", i);
            cell.appendChild(document.createTextNode(cellData));
        });
    });
}



function gioele() {
    const lista = [
        ["Catan", "comp", "1-4"],
        ["Spirit", "coop", "1-4"],
        ["Monopoly", "comp", "2-6"],
        ["Uno", "comp", "2-10"],
        ["Scrabble", "comp", "2-4"],
        ["Dixit", "comp", "3-6"],
        ["Dobble", "comp", "2-8"],
        ["Risiko", "comp", "2-6"],
        ["Cluedo", "comp", "3-6"],
        ["Taboo", "comp", "4-10"],
        ["Bang", "comp", "4-7"],
        ["Munchkin", "comp", "3-6"],
        ["Carcassonne", "comp", "2-5"],
        ["Dobble", "comp", "2-8"],
        ["Risiko", "comp", "2-6"],
        ["Cluedo", "comp", "3-6"],
        ["Taboo", "comp", "4-10"],
        ["Hanabi", "coop", "1-5"]
    ];
    return lista
}