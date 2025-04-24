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
    [df, df_exp] = create_db(dati);
    df_filtrato = filter_db(df);
    creaTabella(df_filtrato, df_exp);

    s_game_name.addEventListener("input", function () {
        listener(s_game_name, 0, df)
    });
    s_players.addEventListener("input", function () {
        listener(s_players, 1, df)
    });
    s_collab.addEventListener("input", function () {
        listener(s_collab, 2, df)
    });
    s_complex.addEventListener("input", function () {
        listener(s_complex, 3, df, true)
    });
    s_time.addEventListener("input", function () {
        listener(s_time, 4, df, true)
    });
}

function listener(input, i, df, vector_inside = false) {
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
    df_filtrato = filter_db(df);
    console.log("printiamo");
    creaTabella(df_filtrato, df_filtrato);
}

function create_db(array_dati) {

    let df = new dfd.DataFrame(array_dati.slice(1, -1), {columns: array_dati[0]});
    let cond_base = df["Exp"].eq("");
    df_exp = df.query(df["Exp"].ne(""));
    let zeroSeries = new dfd.Series(Array(df.shape[0]).fill(0));
    df.addColumn("NumeroEspansioni", zeroSeries, {inplace:true});
    NumeroEspansioniIndex = df.columns.indexOf("NumeroEspansioni");
    df_exp["Exp"].values.forEach(function(nome) {
        vanilla_index = df.loc({rows: df["Titolo"].eq(nome)}).index[0];
        if (vanilla_index) {
            df.values[vanilla_index][NumeroEspansioniIndex] = df.values[vanilla_index][NumeroEspansioniIndex] + 1;
        } else {
            console.log("Problema nelle espansioni di " + nome)
        }
    });
    return [df, df_exp]
}

function filter_db(df) {
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
    return df.query((cond0).and(cond1).and(cond2).and(cond3).and(cond4));

}
function showInfoModal(item) {

  document.getElementById('modalTitle').innerText = item.Titolo;
  document.getElementById('modalContent').innerText = item.Difficoltà;
  document.getElementById('infoModal').classList.remove('hidden');
}

// Hide modal
function closeInfoModal() {
  document.getElementById('infoModal').classList.add('hidden');
}

function creaTabella(df, df_exp) {
    tabella_giochi.removeChild(document.getElementById("tbody_giochi"));

    let tablebody = document.createElement("tbody");
    tablebody.id = "tbody_giochi";
    tabella_giochi.appendChild(tablebody);
    // let array = df.loc({columns: ["Titolo", "Gioc Min", "Gioc Max", "Competizione", "Difficoltà", "Durata"]}).values;

    dfd.toJSON(df).forEach((rowData, index)=> {
        let row_div = document.createElement("tr");
        const bgClass = index % 2 === 0 ? "bg-[#253b2f]" : "bg-[#1f3127]";
        row_div.className = `${bgClass} cursor-pointer hover:bg-[#36543f] transition-colors`;
        tablebody.appendChild(row_div);

        row_div.innerHTML = `
            <td class="px-4 py-2 flex items-center gap-3">
            <div class="w-12"><img src="${rowData.LinkImmagine}" class="h-12 rounded shadow"/></div>
            </td>
            <td class="text-center px-4 py-3">
              <span class="font-semibold px-2">${rowData.Titolo}</span>
            </td>
            <td class="text-center py-3">${rowData["Gioc Min"]}</td>
            <td class="text-center py-3">${rowData["Gioc Max"]}</td>
            <td class="text-center px-2 py-3">${rowData.Competizione}</td>
            <td class="text-center px-2 py-3">${rowData.Difficoltà}</td>
<!--            <td class="text-center px-4 py-3"">${rowData.Durata}</td>-->
<!--            <td class="text-center px-2 py-3"><button class="text-xl" onclick=showInfoModal()>?!</button></td>-->
          `;
        const tdbutton = document.createElement('td');
        tdbutton.className = 'text-center px-2 py-3';
        row_div.appendChild(tdbutton);
        const btn = document.createElement('button');
        btn.className = 'text-xl';
        btn.innerText = '!?';
        btn.addEventListener('click', () => showInfoModal(rowData));
        tdbutton.appendChild(btn);


        // CREATE EXPANSION
        if (rowData["NumeroEspansioni"] >0) {
            const firstCell = row_div.querySelectorAll("td")[1];
            firstCell.innerHTML = `<span class="text-300 text-xl mr-4">⭐</span>${firstCell.textContent}`;
            let exp_array = dfd.toJSON(df_exp.loc({rows: df_exp["Exp"].eq(rowData.Titolo)}));
            row_div.addEventListener("click", () => {
                row_div.classList.toggle("active");
                let nextRow = row_div.nextElementSibling;
                while (nextRow && nextRow.classList.contains("row-details")) {
                    nextRow.style.display = nextRow.style.display === "table-row" ? "none" : "table-row";
                    nextRow = nextRow.nextElementSibling;
                }
            });

            exp_array.forEach((exp) => {
                let ExpansionRow = document.createElement("tr");
                ExpansionRow.style.display='none';
                ExpansionRow.className = "row-details bg-[#2d3e33]";
                ExpansionRow.innerHTML = `
                <td colspan="7" class="px-6 py-4 text-[#d8f3dc]">
                  <strong>Expansion:</strong> ${exp.Exp} — <strong>Title:</strong> ${exp.Titolo}
                </td>
              `;
                tablebody.appendChild(ExpansionRow);
            });

        }
    });
}





// THIS IS OLD PLEASE DELETE
//
// function addInfoRow(rowData) {
//     // Create a new row for additional info
//     let infoRow = document.createElement("tr");
//     infoRow.className = "info-row"; // Add a class for styling
//
//     // Create a cell that spans all columns
//     let infoCell = document.createElement("td");
//     infoCell.colSpan = 6; // Adjust the number based on your table columns
//     infoCell.textContent = "Additional info: " + rowData["Titolo"] + " is a great game!"; // Example content
//
//     // Append the cell to the new row
//     infoRow.appendChild(infoCell);
//
//     // Insert the new row after the current row
//     this.parentNode.insertBefore(infoRow, this.nextSibling);
// }
//
//
// function openNav(div_id) {
//   document.getElementById(div_id).style.width = "clamp(250px, 30vw, 2000px)";
// }
//
// function closeNav(div_id) {
//   document.getElementById(div_id).style.width = "0";
// }
//
// function informationOnTheRight(info_out, rowData) {
//     openNav("info_out");
//
//     info_out.removeChild(document.getElementById("info_in"));
//
//     let info_in = document.createElement("div");
//     info_in.id = "info_in";
//     info_out.appendChild(info_in);
//
//     let a = document.createElement("a");
//     info_in.appendChild(a);
//     a.href = "javascript:closeNav('info_out')";
//     a.className = "closebtn";
//     a.textContent = "\u{279c}";
//
//     let h1 = document.createElement("h4");
//     info_in.appendChild(h1);
//     h1.textContent = rowData["Titolo"];
//
//     let grid = document.createElement("div");
//     grid.className = "grid";
//     info_in.appendChild(grid);
//
//     crea_container("p", grid, "Giocatori: ");
//     crea_container("p", grid, rowData["Gioc Min"] + " - "+ rowData["Gioc Max"]);
//
//     crea_container("p", grid, "Competizione: ");
//     crea_container("p", grid, rowData["Competizione"]);
//
//     crea_container("p", grid, "Anno: ");
//     crea_container("p", grid, rowData["Anno"]);
//
//     crea_container("p", grid, "Autori: ");
//     crea_container("p", grid, rowData["Autori"]);
//
//     crea_container("p", grid, "Casa Editrice: ");
//     crea_container("p", grid, rowData["Casa Editrice"]);
// }
//
//
//
//
// function crea_container(tipo, padre, contenutotestuale) {
//     let elem = document.createElement(tipo);
//     padre.appendChild(elem);
//     elem.textContent = contenutotestuale;
// }
//
