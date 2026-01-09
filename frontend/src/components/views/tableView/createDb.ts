import * as dfd from "danfojs"
import {GameItem} from "./gameType";
import {userInputs} from "./SideBar";
import {SheetData} from "../../utils/types";
import {columnNames} from "../../utils/column_names"
import React from "react";
import fetchSheet from "../../utils/fetchSheet";

type gameRowInfo = string[];

export type dataframe = dfd.DataFrame;

export async function createDb(): Promise<dataframe> {

    try {
        const promiseSheetData: Promise<SheetData> = fetchSheet("Database")
        const array_dati: gameRowInfo[] = await promiseSheetData;
        console.log('dbCreator was called and obtain data:', array_dati);

        const df = new dfd.DataFrame(array_dati.slice(1, -1), {columns: array_dati[0]});
        return splitExpansions(df);

    } catch (error) {
        console.error('Errore in dbHandler:', error);
        return new dfd.DataFrame;

    }
}


function splitExpansions(df: dfd.DataFrame): dfd.DataFrame {

    const df_exp: dfd.DataFrame = df.query(df[columnNames.EXPANSION].ne(""));

    let zeroSeries = new dfd.Series(Array(df.shape[0]).fill(''));
    df.addColumn("IndiceEspansioni", zeroSeries, {inplace: true});

    df_exp.index.forEach((index)=>{
        const expRow: string[] = df_exp.loc({rows: [index]}).values[0] as string[];
        const expName: string = expRow[df_exp.columns.indexOf(columnNames.EXPANSION)];
        const baseGameIndeces: number[] = df.loc(
            {rows: df[columnNames.TITLE].eq(expName), columns: ['IndiceEspansioni']}
        ).index as number[]; // the array of indices of the possible base games... should be of length 1

        if (baseGameIndeces.length == 1) {
            const baseIndex: number = baseGameIndeces[0];
            ((df.values[baseIndex] as any)[df.columns.indexOf('IndiceEspansioni')] as any) += `${index}, `
        } else {
            console.log("Problema nell' espansione " + expRow[df_exp.columns.indexOf(columnNames.TITLE)])
        }
        // df.loc({rows:[8], columns:['Titolo', 'IndiceEspansioni']}).print();
    });
    return df
}

export function filterDb(df: dfd.DataFrame, userInputs: userInputs,
                         setRows: React.Dispatch<React.SetStateAction<GameItem[] | null>>) {
    console.log('Called db filter')
    const players: number = Number(userInputs.players.curValue.replace(/\+$/, ''));
    const temporary_only_expansion_show = false

    const cond_base = df[columnNames.EXPANSION].eq("");
    const cond_name = df[columnNames.TITLE].str.toLowerCase().str.includes(userInputs.search.curValue.toLowerCase());
    const players_cond = (df[columnNames.PLAYERS_MIN].le(players).and(df[columnNames.PLAYERS_MAX].ge(players))).or(players == 0);
    const collab_cond = isinArray(df[columnNames.COMPETITION_CAT], userInputs.collab.curValue);
    const difficulty_cond = isinArray(df[columnNames.DIFFICULTY_CAT], userInputs.complexity.curValue);
    const duration_cond = isinArray(df[columnNames.DURATION_CAT], userInputs.time.curValue);
    const typologies_cond = isinArray(df[columnNames.TYPOLOGIES], userInputs.categ.curValue);
    const authors_cond = isinArray(df[columnNames.AUTHORS], [userInputs.authors.curValue]);
    const publisher_cond = isinArray(df[columnNames.PUBLISHER], [userInputs.publisher.curValue]);
    const publisher_IT_cond = isinArray(df[columnNames.PUBLISHER_IT], [userInputs.publisher.curValue]);

    let filtered_db: dfd.DataFrame = df.query((cond_name)
        .and( temporary_only_expansion_show ? cond_base : true)
        .and(players_cond)
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

