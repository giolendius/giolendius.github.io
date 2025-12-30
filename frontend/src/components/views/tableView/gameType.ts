import {columnNames} from "../../utils/column_names";

export interface GameItem {
    Titolo: string,
    LinkImmagine: string,
    "Gioc Min": number,
    "Gioc Max": number,
    Competizione: string,
    "Difficoltà": string,
    Durata: string,
    Exp: string
}

type ValueKeys = typeof columnNames[keyof typeof columnNames];

let prova: ValueKeys = "Link BGG"

interface MyInterface { [K in ValueKeys]: string; }

