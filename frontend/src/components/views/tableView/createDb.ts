import * as dfd from "danfojs"
import {GameItem} from "./gameType";
import {userInputs} from "./SideBar";
import {SheetData} from "../../utils/types";
import {columnNames} from "../../utils/column_names"
import React from "react";
import fetchSheet from "../../utils/fetchSheet";

type riga = string[];

export type dataframe = dfd.DataFrame;

export async function createDb(): Promise<dataframe> {

    try {
        const promiseSheetData: Promise<SheetData> = fetchSheet("Database")
        const dati: riga[] = await promiseSheetData;
        console.log('dbCreator was called and obtain data:', dati);

        const [df_base, df_exp] = create_db(dati);
        return df_base

    } catch (error) {
        console.error('Errore in dbHandler:', error);
        return new dfd.DataFrame;

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

export function filterDb(df: dfd.DataFrame, userInputs: userInputs,
                         setRows: React.Dispatch<React.SetStateAction<GameItem[] | null>>) {
    console.log('Called db filter')
    const cond0 = df[columnNames.TITLE].str.toLowerCase().str.includes(userInputs.search.curValue.toLowerCase());
    const players: number = Number(userInputs.players.curValue.replace(/\+$/, ''));

    let name_cond = (df[columnNames.PLAYERS_MIN].le(players).and(df[columnNames.PLAYERS_MAX].ge(players))).or(players == 0);
    let collab_cond = isinArray(df[columnNames.COMPETITION_CAT], userInputs.collab.curValue);
    let difficulty_cond = isinArray(df[columnNames.DIFFICULTY_CAT], userInputs.complexity.curValue);
    let duration_cond = isinArray(df[columnNames.DURATION_CAT], userInputs.time.curValue);
    let typologies_cond = isinArray(df[columnNames.TYPOLOGIES], userInputs.categ.curValue);
    let authors_cond = isinArray(df[columnNames.AUTHORS], [userInputs.authors.curValue]);
    let publisher_cond = isinArray(df[columnNames.PUBLISHER], [userInputs.publisher.curValue]);
    let publisher_IT_cond = isinArray(df[columnNames.PUBLISHER_IT], [userInputs.publisher.curValue]);

    let filtered_db: dfd.DataFrame = df.query((cond0)
        .and(name_cond)
        .and(collab_cond)
        .and(difficulty_cond)
        .and(duration_cond)
        .and(typologies_cond)
        .and(authors_cond)
        .and(publisher_cond.or(publisher_IT_cond)));
    const games = dfd.toJSON(filtered_db) as GameItem[];
    setRows(games);
}

/**
 * Check if values in a series are within a given array
 *
 * @param series - The series to check if it satisfies the condition
 * @param array - The array of admissible
 * @returns A series of booleans indicating if each element in the series is in the array
 */
function isinArray(series: dfd.Series, array: string[]): dfd.Series {
    let condition = new dfd.Series(Array(series.values.length).fill(array.length === 0));

    const normalizedSeries = new dfd.Series(series.values.map(
        (val: any) => normalizeString(String(val)))
    );

    for (let i = 0; i < array.length; i++) {
        const searchedTerm: string = normalizeString(array[i]);
        condition = normalizedSeries.str.includes(searchedTerm).or(condition);
    }
    return condition;
}


function normalizeString(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}