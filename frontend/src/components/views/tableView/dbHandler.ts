import * as dfd from "danfojs"
import {GameItem} from "./gameType";
import {userInputs} from "./SideBar";
import {SheetData} from "../../utils/types";
import {columnNames} from "../../utils/column_names"
import React from "react";

type riga = string[];

export async function dbHandler(promiseSheetData: Promise<SheetData>,
                                userInputs: userInputs,
                                setRows: React.Dispatch<React.SetStateAction<GameItem[] | null>>) {

    try {
        const dati: riga[] = await promiseSheetData;
        console.log('chiamato dbhandler per dati:', dati);

        const [df_base, df_exp] = create_db(dati);
        const df_filtrato = filter_db(df_base, userInputs);
        const games = dfd.toJSON(df_filtrato) as GameItem[];
        setRows(games);
    } catch (error) {
        console.error('Errore in dbHandler:', error);

    }
}


function create_db(array_dati: riga[]): [dfd.DataFrame, dfd.DataFrame] {

    let df = new dfd.DataFrame(array_dati.slice(1, -1), {columns: array_dati[0]});
    // let cond_base = df["Exp"].eq("");

    const df_exp = df.query(df[columnNames.EXPANSION].ne(""));
    let zeroSeries = new dfd.Series(Array(df.shape[0]).fill(0));
    df.addColumn("NumeroEspansioni", zeroSeries, {inplace: true});
    // let NumeroEspansioniIndex: number = df.columns.indexOf("NumeroEspansioni");

//    The Following code was blocking execution. But the idea could still be interesting

//    df_exp["Exp"].values.forEach(function(nome) {
//        vanilla_index = df.loc({rows: df["Titolo"].eq(nome)}).index[0];
//        if (vanilla_index) {
//            df.values[vanilla_index][NumeroEspansioniIndex] = df.values[vanilla_index][NumeroEspansioniIndex] + 1;
//        } else {
//            console.log("Problema nelle espansioni di " + nome)
//        }
//    });
    let df_base = df.query(df[columnNames.EXPANSION].eq("")).resetIndex();
    return [df_base, df_exp]
}

function filter_db(df: dfd.DataFrame, userInputs: userInputs): dfd.DataFrame {
    const cond0 = df[columnNames.TITLE].str.toLowerCase().str.includes(userInputs.search.curValue.toLowerCase());
    const players: number = Number(userInputs.players.curValue.replace(/\+$/, ''));
    let cond1 = (df[columnNames.PLAYERS_MIN].le(players).and(df[columnNames.PLAYERS_MAX].ge(players))).or(players == 0);

    let cond2 = df[columnNames.COMPETITION_CAT].str.toLowerCase().str.includes(userInputs.collab.curValue).or(userInputs.collab.curValue.length === 0);
    let cond3 = isinArray(df[columnNames.DIFFICULTY_CAT], userInputs.complexity.curValue);
    let cond4 = isinArray(df[columnNames.DURATION_CAT], userInputs.time.curValue);
    let cond5 = isinArray(df[columnNames.TYPOLOGIES], userInputs.categ.curValue);
    return df.query((cond0).and(cond1).and(cond2).and(cond3).and(cond4).and(cond5));

}

function isinArray(series: dfd.Series, array: string[]) {
    let condition = new dfd.Series(Array(series.values.length).fill(array.length === 0));
    for (let i = 0; i < array.length; i++) {
        condition = series.str.toLowerCase().eq(array[i].toLowerCase() as any).or(condition);
    }
    return condition;
}


//
// function creaTabella(df: dfd.DataFrame, df_exp: dfd.DataFrame) {
//
//     const tabella_giochi = document.getElementById("tabella_giochi")!;
//
//
//     tabella_giochi.removeChild(document.getElementById("tbody_giochi"));
//
//     let tablebody = document.createElement("tbody");
//     tablebody.id = "tbody_giochi";
//     tabella_giochi.appendChild(tablebody);
//     // let array = df.loc({columns: ["Titolo", "Gioc Min", "Gioc Max", "Competizione", "Difficoltà", "Durata"]}).values;
//
//     dfd.toJSON(df).forEach((rowData, index) => {
//         let row_div = document.createElement("tr");
//         const bgClass = index % 2 === 0 ? "greenD" : "green-DD";
//         row_div.className = `${bgClass} cursor-pointer hover:bg-[#36543f] transition-colors`;
//         tablebody.appendChild(row_div);
//
//
//         innerHTMLst = `
//             <td class="px-2 md:px-4 py-2 flex items-center gap-3">
//                 <div class="w-12"><img src="${rowData.LinkImmagine}" class="h-12 rounded shadow"/></div>
//             </td>
//             <td class="text-center md:px-4 py-3">
//               <span class="font-semibold px-2">${rowData.Titolo}</span>
//             </td>
//             <td class="text-center py-3">${rowData["Gioc Min"]}</td>
//             <td class="text-center py-3">${rowData["Gioc Max"]}</td>`;
//
//         //if medium screen or larger, also show Competizione/Comp
//         const isMediumScreen = window.matchMedia("(min-width: 768px)").matches;
//         if (isMediumScreen) {
//             innerHTMLst += `
//             <td class="text-center px-2 py-3">${rowData.Competizione}</td>
//             <td class="text-center px-2 py-3">${rowData.Difficoltà}</td>
//             <td class="text-center px-4 py-3">${rowData.Durata}</td>`;
//         }
//
//         row_div.innerHTML = innerHTMLst;
//         const tdbutton = document.createElement('td');
//         tdbutton.className = 'text-center px-3 py-3 w-10';
//         row_div.appendChild(tdbutton);
//         const btn = document.createElement('button');
//         // btn.className = 'text-xl';
//         btn.className = 'text-[#1f3127] bg-yellow-400 hover:bg-yellow-600 hover:text-white font-bold rounded-full w-10 h-10 ' +
//             'flex items-center justify-center text-xl shadow-md transition';
//
//         btn.innerText = '?';
//         btn.addEventListener('click', () => showInfoModal(rowData));
//         tdbutton.appendChild(btn);
//
//
//         // CREATE EXPANSION
//         if (rowData["NumeroEspansioni"] > 0) {
//             const firstCell = row_div.querySelectorAll("td")[1];
//             firstCell.innerHTML = `<span class="text-300 text-xl mr-4">⭐</span>${firstCell.textContent}`;
//             let exp_array = dfd.toJSON(df_exp.loc({rows: df_exp["Exp"].eq(rowData.Titolo)}));
//             row_div.addEventListener("click", () => {
//                 row_div.classList.toggle("active");
//                 let nextRow = row_div.nextElementSibling;
//                 while (nextRow && nextRow.classList.contains("row-details")) {
//                     nextRow.style.display = nextRow.style.display === "table-row" ? "none" : "table-row";
//                     nextRow = nextRow.nextElementSibling;
//                 }
//             });
//
//             exp_array.forEach((exp) => {
//                 let ExpansionRow = document.createElement("tr");
//                 ExpansionRow.style.display = 'none';
//                 ExpansionRow.className = "row-details bg-[#2d3e33]";
//                 ExpansionRow.innerHTML = `
//                 <td colspan="8" class="px-6 py-4 text-[#d8f3dc]">
//                   <strong>Expansion:</strong> ${exp.Titolo}
//                 </td>
//               `;
//                 tablebody.appendChild(ExpansionRow);
//             });
//
//         }
//     });
// }