// import {showInfoModal} from "./infoModal";
import {getElementById} from "../../utils/utils";
import * as dfd from "danfojs"

type riga = string[];

export interface jsonGame {
    Titolo: string,
    LinkImmagine: string,
    "Gioc Min": number,
    "Gioc Max": number,
    Competizione: string,
    Difficoltà: string,
    Durata: string,
    Exp: string
}

export function dbHandler(dati: riga[]): jsonGame[] {
    console.log('chiamato dbhandler', dati)
    let filtered_db: dfd.DataFrame = listen_filter_show(dati);
    return dfd.toJSON(filtered_db) as jsonGame[];
}

let v = ["", "", "", [""], [""], ""];


function listen_filter_show(dati: string[][]): dfd.DataFrame {
    let s_game_name = getElementById("s_game_name");
    let s_players = getElementById("s_players");
    let s_collab = getElementById("s_collab");
    let s_complex = getElementById("s_complex");
    let s_time = getElementById("s_time");

    let df: dfd.DataFrame = new dfd.DataFrame(dati.slice(1, -1), {columns: dati[0]});
    // let filtered_data = dfd.toJSON(df)
    // if (filtered_data) {
    //     return filtered_data}
    // else {return []}
    return df
    // [df_base, df_exp] = create_db(dati);
    // df_filtrato = filter_db(df);
    // df_filtrato = filter_db(df_base);
    // creaTabella(df_filtrato, df_exp);
    // creaTabella(df_base, df_exp);

    // s_game_name.addEventListener("input", function () {
    //     listener(s_game_name, 0, df_base)
    // });
    // s_players.addEventListener("input", function () {
    //     listener(s_players, 1, df_base)
    // });
    // s_collab.addEventListener("input", function () {
    //     listener(s_collab, 2, df_base)
    // });
    // s_complex.addEventListener("input", function () {
    //     listener(s_complex, 3, df_base, true)
    // });
    // s_time.addEventListener("input", function () {
    //     listener(s_time, 4, df_base, true)
    // });
}

// function listener(input, i, df, vector_inside = false) {
//     if (vector_inside) {
//         tmp = [];
//         for (let j = 0; j < input.selectedOptions.length; j++) {
//             tmp.push(input.selectedOptions[j].value);
//         }
//         console.log("come pensavo", i)
//     } else {
//         tmp = input.value
//     }
//     v[i] = tmp;
//     df_filtrato = filter_db(df);
//     console.log("printiamo");
//     creaTabella(df_filtrato, df_exp);
// }

function create_db(array_dati) {

    let df = new dfd.DataFrame(array_dati.slice(1, -1), {columns: array_dati[0]});
    let cond_base = df["Exp"].eq("");

    df_exp = df.query(df["Exp"].ne(""));
    let zeroSeries = new dfd.Series(Array(df.shape[0]).fill(0));
    df.addColumn("NumeroEspansioni", zeroSeries, {inplace:true});
    NumeroEspansioniIndex = df.columns.indexOf("NumeroEspansioni");

//    The Following code was blocking execution. But the idea could still be interesting

//    df_exp["Exp"].values.forEach(function(nome) {
//        vanilla_index = df.loc({rows: df["Titolo"].eq(nome)}).index[0];
//        if (vanilla_index) {
//            df.values[vanilla_index][NumeroEspansioniIndex] = df.values[vanilla_index][NumeroEspansioniIndex] + 1;
//        } else {
//            console.log("Problema nelle espansioni di " + nome)
//        }
//    });
    let df_base = df.query(df["Exp"].eq("")).resetIndex();
    return [df_base, df_exp]
}

function filter_db(df1) {
    let cond0 = df1["Titolo"].str.toLowerCase().str.includes(v[0].toLowerCase()).or("abc" === "");
    let cond1 = (df1["Gioc Min"].le(Number(v[1]))
        .and(df1["Gioc Max"].ge(Number(v[1]))))
        .or(v[1] == "");
    let cond2 = df1["Competizione"].str.toLowerCase().str.includes(v[2]).or(v[2] == "");
    let cond3 = (v[3][0] === "");
    for (let i = 0; i < v[3].length; i++) {
        cond3 = (df1["Difficoltà"].eq(v[3][i])).or(cond3);
    };
    let cond4 =  (v[4][0] === "");
    for (let h = 0; h < v[4].length; h++) {
        cond4 = (df1["Durata"].eq(v[4][h])).or(cond4);
    }
    // let cond4 = df1["Durata"].eq(v[4]).or(v[4] === "");
    return df1.query((cond0).and(cond1).and(cond2).and(cond3).and(cond4));

}




function creaTabella(df: dfd.DataFrame, df_exp: dfd.DataFrame) {

    const tabella_giochi = document.getElementById("tabella_giochi")!;


    tabella_giochi.removeChild(document.getElementById("tbody_giochi"));

    let tablebody = document.createElement("tbody");
    tablebody.id = "tbody_giochi";
    tabella_giochi.appendChild(tablebody);
    // let array = df.loc({columns: ["Titolo", "Gioc Min", "Gioc Max", "Competizione", "Difficoltà", "Durata"]}).values;

    dfd.toJSON(df).forEach((rowData, index)=> {
        let row_div = document.createElement("tr");
        const bgClass = index % 2 === 0 ? "greenD" : "green-DD";
        row_div.className = `${bgClass} cursor-pointer hover:bg-[#36543f] transition-colors`;
        tablebody.appendChild(row_div);


        innerHTMLst = `
            <td class="px-2 md:px-4 py-2 flex items-center gap-3">
                <div class="w-12"><img src="${rowData.LinkImmagine}" class="h-12 rounded shadow"/></div>
            </td>
            <td class="text-center md:px-4 py-3">
              <span class="font-semibold px-2">${rowData.Titolo}</span>
            </td>
            <td class="text-center py-3">${rowData["Gioc Min"]}</td>
            <td class="text-center py-3">${rowData["Gioc Max"]}</td>`;

        //if medium screen or larger, also show Competizione/Comp
        const isMediumScreen = window.matchMedia("(min-width: 768px)").matches;
        if (isMediumScreen) {
            innerHTMLst+= `
            <td class="text-center px-2 py-3">${rowData.Competizione}</td>
            <td class="text-center px-2 py-3">${rowData.Difficoltà}</td>
            <td class="text-center px-4 py-3">${rowData.Durata}</td>`;       }

        row_div.innerHTML=innerHTMLst;
        const tdbutton = document.createElement('td');
        tdbutton.className = 'text-center px-3 py-3 w-10';
        row_div.appendChild(tdbutton);
        const btn = document.createElement('button');
        // btn.className = 'text-xl';
        btn.className = 'text-[#1f3127] bg-yellow-400 hover:bg-yellow-600 hover:text-white font-bold rounded-full w-10 h-10 ' +
            'flex items-center justify-center text-xl shadow-md transition';

        btn.innerText = '?';
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
                <td colspan="8" class="px-6 py-4 text-[#d8f3dc]">
                  <strong>Expansion:</strong> ${exp.Titolo}
                </td>
              `;
                tablebody.appendChild(ExpansionRow);
            });

        }
    });
}