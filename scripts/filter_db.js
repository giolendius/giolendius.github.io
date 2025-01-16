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
// https://docs.google.com/spreadsheets/d/1RnaUmV5fSHc3oyIf62DhY3m21oLaS6xh2ss3KcMzKn8/edit?gid=1973594395#gid=1973594395
fetch(sheetLink).then(response => response.json())
    .catch(error => console.error('Error fatching Google sheet:', error))
    .then(json => json["values"]//.slice(1,-1)
    )
    .then(dati => listen_filter_show(dati))

let v = ["", "", "", [""], [""], ""];

tabella_giochi = document.getElementById("tabella_giochi");

function listen_filter_show(dati) {
    let s_game_name = document.getElementById("s_game_name");
    let s_players = document.getElementById("s_players");
    let s_collab = document.getElementById("s_collab");
    let s_complex = document.getElementById("s_complex");
    let s_time = document.getElementById("s_time");
    [dati_filtrati, ciao] = create_db_and_filter(dati);
    creaTabella(dati_filtrati)
    s_game_name.addEventListener("input", function () {
        listener(s_game_name, 0, dati)
    });
    s_players.addEventListener("input", function () {
        listener(s_players, 1, dati)
    });
    s_collab.addEventListener("input", function () {
        listener(s_collab, 2, dati)
    });
    s_complex.addEventListener("input", function () {
        listener(s_complex, 3, dati, true)
    });
    s_time.addEventListener("input", function () {
        listener(s_time, 4, dati, true)
    });
}

function listener(input, i, dati, vector_inside = false) {
    if (vector_inside) {
        tmp = [];
        for (let j = 0; j < input.selectedOptions.length; j++) {
            tmp.push(input.selectedOptions[j].value);
        }
        console.log("come pensavo", i)
    } else {
        tmp = input.value
    }
    v[i] = tmp;
    [db_filtrati, df_exp] = create_db_and_filter(dati);
    console.log("printiamo");
    df_exp.print();
    creaTabella(db_filtrati);
}

function create_db_and_filter(array_dati) {
    let df = new dfd.DataFrame(array_dati.slice(1, -1), {columns: array_dati[0]});
    let cond_base = df["Exp"].eq("");
    df_exp = df.query(df["Exp"].ne(""));
    // console.log(prova);
    // df["Titolo"] = df["Titolo"].str.capitalize();
    let cond0 = df["Titolo"].str.toLowerCase().str.includes(v[0].toLowerCase()).or("abc" === "");
    let cond1 = (df["Gioc Min"].le(Number(v[1]))
        .and(df["Gioc Max"].ge(Number(v[1]))))
        .or(v[1] == "");
    let cond2 = df["Competizione"].str.toLowerCase().str.includes(v[2]).or(v[2] == "");
    let cond3 = (v[3][0] === "");
    for (let i = 0; i < v[3].length; i++) {
        cond3 = (df["Difficoltà"].eq(v[3][i])).or(cond3);
    };
    let cond4 =  (v[4][0] === "");
    for (let h = 0; h < v[4].length; h++) {
        cond4 = (df["Durata"].eq(v[4][h])).or(cond4);
    }
    // let cond4 = df["Durata"].eq(v[4]).or(v[4] === "");
    return [df.query((cond_base).and(cond0).and(cond1).and(cond2).and(cond3).and(cond4)),df_exp];

}

function creaTabella(df) {
    tabella_giochi.removeChild(document.getElementById("tbody_giochi"));

    let tablebody = document.createElement("tbody");
    tablebody.id = "tbody_giochi";
    tabella_giochi.appendChild(tablebody);
    let array = df.loc({columns: ["Titolo", "Gioc Min", "Gioc Max", "Competizione", "Difficoltà", "Durata"]}).values;

    dfd.toJSON(df).forEach(function (rowData) {
        let row_div = document.createElement("tr");
        row_div.className = "norm";
        tablebody.appendChild(row_div);

        let main_keys = ["Titolo", "Gioc Min", "Gioc Max", "Competizione", "Difficoltà", "Durata"];
        main_keys.forEach(function (key) {
            let cell = document.createElement("td");
            row_div.appendChild(cell);
            cell.appendChild(document.createTextNode(rowData[key]));
        });

        if (rowData["Titolo"] === "13 indizi") {
            row_ex = document.createElement("tr")
            tablebody.appendChild(row_ex);
            // row_ex.className = "exp";

            td_ex = document.createElement("td");
            td_ex.style.padding = "0 2em";
            row_ex.appendChild(td_ex);
            td_ex.colSpan = 6;

            cell_ex = document.createElement("div");
            cell_ex.className = "with-expansions";
            td_ex.appendChild(cell_ex);

            cell_ex.appendChild(document.createTextNode("Catan è un gioco da tavolo di strategia ambientato sull'isola " +
                "di Catan. I giocatori raccolgono risorse e le scambiano con gli altri giocatori per costruire strade, città e insediamenti. " +
                "Il primo giocatore a raggiungere un certo numero di punti vince il gioco." +
                "" +
                "Catan è un gioco da tavolo di strategia ambientato sull'isola " +
                "di Catan. I giocatori raccolgono risorse e le scambiano con gli altri giocatori per costruire strade, città e insediamenti. " +
                "Il primo giocatore a raggiungere un certo numero di punti vince il gioco."))
            // addInfoRow(rowData);
            let exp_height = "120px";
            row_div.addEventListener("click", function()
            {
                cell_ex.style.height = exp_height;
                cell_ex.style.margin = "2em";}
            );
        }

        row_div.addEventListener("click", function()
        {
            informationOnTheRight(info_out, rowData);}
        );
    });
}

function addInfoRow(rowData) {
    // Create a new row for additional info
    let infoRow = document.createElement("tr");
    infoRow.className = "info-row"; // Add a class for styling

    // Create a cell that spans all columns
    let infoCell = document.createElement("td");
    infoCell.colSpan = 6; // Adjust the number based on your table columns
    infoCell.textContent = "Additional info: " + rowData["Titolo"] + " is a great game!"; // Example content

    // Append the cell to the new row
    infoRow.appendChild(infoCell);

    // Insert the new row after the current row
    this.parentNode.insertBefore(infoRow, this.nextSibling);
}


function openNav(div_id) {
  document.getElementById(div_id).style.width = "clamp(250px, 30vw, 2000px)";
}

function closeNav(div_id) {
  document.getElementById(div_id).style.width = "0";
}

function informationOnTheRight(info_out, rowData) {
    openNav("info_out");
    //            let info_out = document.getElementById("info_out");
    //            info_out.className = "show info_out"

            info_out.removeChild(document.getElementById("info_in"));

            let info_in = document.createElement("div");
            info_in.id = "info_in";
            info_out.appendChild(info_in);

            let a = document.createElement("a");
            info_in.appendChild(a);
            a.href="javascript:closeNav('info_out')";
            a.className="closebtn";
            a.textContent="\u{279c}";

            let h1=document.createElement("h1");
            info_in.appendChild(h1);
            h1.textContent = rowData["Titolo"];

            let pp=document.createElement("p");
            info_in.appendChild(pp);
            pp.textContent = "Giocatori: da " + rowData["Gioc Min"]+" a "+rowData["Gioc Max"];

            info_in.appendChild(document.createTextNode(rowData["Competizione"]));}

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


