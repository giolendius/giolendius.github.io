import {keys, env} from "./constants";
import {SheetData} from "./types";

export default async function fetchSheet(): Promise<SheetData> {
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
    return fetch(sheetLink).then(response => response.json())
        .catch(error => {
            console.error('Error fatching Google sheet:', error);
            return []
        })
        .then(json => {
            console.log('Chiamato api');
            return json["values"];
        })
    // .then(() =>{ , dati)})
    // .then(dati => listen_filter_show(dati))
}