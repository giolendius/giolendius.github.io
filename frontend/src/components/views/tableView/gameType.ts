import {columnNames} from "../../utils/column_names";

type ourKeys = typeof columnNames[keyof typeof columnNames];

export type GameItem = {
    [K in ourKeys]: string;
};