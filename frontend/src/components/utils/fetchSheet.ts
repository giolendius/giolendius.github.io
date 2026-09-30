import {SheetData} from "./types";

type sheetname = 'Database' | 'Todo' | 'VittorieHanabi';

const sheetIds: Record<sheetname, string> = {
    'Database': "1RnaUmV5fSHc3oyIf62DhY3m21oLaS6xh2ss3KcMzKn8",
    'Todo': "1RnaUmV5fSHc3oyIf62DhY3m21oLaS6xh2ss3KcMzKn8",
    'VittorieHanabi': "1h7IvoNZO3YYa0biNw5IfTobiYkSWuyenDjNThKjCGRM",
}

export default async function fetchSheet(sheetname: sheetname): Promise<SheetData> {

    let sheetLink = "https://sheets.googleapis.com/v4/spreadsheets/" +
        sheetIds[sheetname] +
        "/values/" +
        sheetname +
        "/?key=" +
        key;
    // https://docs.google.com/spreadsheets/d/1RnaUmV5fSHc3oyIf62DhY3m21oLaS6xh2ss3KcMzKn8/edit?gid=1973594395#gid=1973594395
    return fetch(sheetLink).then(response => response.json())
        .catch(error => {
            console.error('Error fatching Google sheet:', error);
            return []
        })
        .then(json => {
            console.log('Chiamato api');
            return json["values"];
        })
}
// https://sheets.googleapis.com/v4/spreadsheets/1RnaUmV5fSHc3oyIf62DhY3m21oLaS6xh2ss3KcMzKn8/values/Database/?key=AIzaSyCbSHnGb-q7SXpjUqoWg2eGJy8CEaahauw
// https://sheets.googleapis.com/v4/spreadsheets/1h7IvoNZO3YYa0biNw5IfTobiYkSWuyenDjNThKjCGRM/values/Vittorie/?key=AIzaSyCbSHnGb-q7SXpjUqoWg2eGJy8CEaahauw

const key = "AIzaSyCbSHnGb-q7SXpjUqoWg2eGJy8CEaahauw"