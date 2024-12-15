let chiave = keys[env]
let schl = {"dev":"1WgYYSWL6uOdjfEGFeQ",
"prod": "Zw6N3_JFjwqPsMt41c"}
let sheetLink = "https://sheets.googleapis.com/v4/spreadsheets/" +
    "1YuvMg055gT-pA0brzaKnK9PJqH8Z0bGdPez79sdWR8c" +
    "/values/" +
    "ElencoGiochiDatabase" +
    "/?key=AIzaSyC" + chiave + schl[env];

fetch(sheetLink).then(response => response.json())
    .catch(error => console.error('Error fatching Google sheet:', error))
    .then(json => json["values"].slice(1,-1))
    .then(dati => listen_filter_show(dati))

let v=["", "", "", "",""];

tabella_giochi = document.getElementById("tabella_giochi");

function create_db_and_filter(array_dati) {
    let df = new dfd.DataFrame(array_dati);
    df = df.loc({columns: ["0","1","2", "4","5", "6"]});
    df.rename({0: "name", 1: "p_min", 2: "p_max", 4:"collab", 5:"complex", 6:"time"}, {inplace: true});

    // df.asType({"p_min": "int32"})

    let cond0 = df["name"].str.toLowerCase().str.includes(v[0].toLowerCase()).or("abc" === "");
    let cond1 = (df["p_min"].le(Number(v[1]))
            .and(df["p_max"].ge(Number(v[1]))))
        .or(v[1] == "");
    let cond2 = df["collab"].eq(v[2]).or(v[2] == "");
    let cond3 = df["complex"].eq(v[3]).or(v[3] === "");
    console.log("cond1", cond1);
    // let cond2 = df["complex"].eq(v[2]).or(v[2] == "");
    return df.query((cond0).and(cond1).and(cond2).and(cond3)).values;

}

function creaTabella(array){
    tabella_giochi.removeChild(document.getElementById("tbody_giochi"));
    let tablebody = document.createElement("tbody");
    tablebody.id = "tbody_giochi";
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

function listener(input, i, dati) {
    v[i] = input.value;
    dati_filtrati = create_db_and_filter(dati);
    creaTabella(dati_filtrati)}

function listen_filter_show(dati) {
    let s_game_name = document.getElementById("s_game_name");
    let s_players = document.getElementById("s_players");
    let s_collab = document.getElementById("s_collab");
    let s_complex = document.getElementById("s_complex");
    dati_filtrati = create_db_and_filter(dati);
    creaTabella(dati_filtrati)
    s_game_name.addEventListener("input", function(){listener(s_game_name, 0, dati)});
    s_players.addEventListener("input", function(){listener(s_players, 1, dati)});
    s_collab.addEventListener("input", function(){listener(s_collab, 2, dati)});
    s_complex.addEventListener("input", function(){listener(s_complex, 3, dati)});
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