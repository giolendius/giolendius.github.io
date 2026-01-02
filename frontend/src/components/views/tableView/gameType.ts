import {columnNames} from "../../utils/column_names";

export type ItalianSheetColumnNames = typeof columnNames[keyof typeof columnNames];

export type GameItem = {
    [K in ItalianSheetColumnNames]: string;
};