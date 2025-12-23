import React from 'react';
import {NewNavbar} from "../../navbar";
import {setPageT} from "../views";
import {dbHandler, jsonGame} from "./dbHandler";

type TableViewProps = {
    setPage: setPageT; PromiseSheetData: Promise<string[][]>
};

export default function TableView(props: TableViewProps) {

    return <div>
        <NewNavbar setPage={props.setPage} activeLinkName={'table'}/>
        <div className="bg-black relative flex transition-all duration-300">
            <Sidebar/>
            <OpenCloseButton/>
            <MainTable PromiseSheetData={props.PromiseSheetData}/>
        </div>
    </div>
}

function Sidebar() {
    return <div id="sidebarWrapper"
                className="bg-[#121212] md:bg-black md:relative absolute top-0 left-0 sidebar w-64 h-full py-2 transition-all duration-300">

        <div className="flex sticky top-0 pl-4 p-8 max-h-screen overflow-y-auto overflow-hidden flex-col md:block space-y-0
                md:space-y-6  space-x-4 md:space-x-0 md:mb-0 md:text-left ">
            <h1 className="m-auto p-4 text-2xl font-bold text-[#b7e4c7]"> Parametri </h1>
            <div className="mt-12 mb-4">
                <label htmlFor="s_game_name" className="block mb-1 text-sm font-medium text-[#b7e4c7]">Cerca per
                    nome..</label>
                <input id="s_game_name" type="text" placeholder="Cerca..."
                       className="w-full p-2 rounded bg-[#2d3e33] text-white border border-[#3a5244] focus:outline-none focus:ring-2 focus:ring-[#95d5b2]"/>
            </div>
            <div className="mb-4">
                <label htmlFor="s_players" className="block mb-1 text-sm font-medium text-[#b7e4c7]">Numero di
                    giocatori</label>
                <select id="s_players"
                        className="w-full p-2 rounded bg-[#2d3e33] text-white border border-[#3a5244] focus:outline-none focus:ring-2 focus:ring-[#95d5b2]">
                    {/*<option value=""></option>*/}
                    {/*<option value=1>1</option>*/}
                    {/*<option value=2>2</option>*/}
                    {/*<option value=3>3</option>*/}
                    {/*<option value=4>4</option>*/}
                    {/*<option value=5>5</option>*/}
                    {/*<option value=6>6</option>*/}
                    {/*<option value=7>7</option>*/}
                    {/*<option value=8>8</option>*/}
                    {/*<option value=9>9</option>*/}
                    {/*<option value=10>10</option>*/}
                    {/*<option value=12>12</option>*/}
                    {/*<option value=14>14</option>*/}
                    {/*<option value=16>16+</option>*/}
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="s_collab"
                       className="block mb-1 text-sm font-medium text-[#b7e4c7]">Cooperazione: </label>
                <select id="s_collab"
                        className="w-full p-2 rounded bg-[#2d3e33] text-white border border-[#3a5244] focus:outline-none focus:ring-2 focus:ring-[#95d5b2]">
                    <option value="" selected></option>
                    <option value="cooperativo">COOPerativo</option>
                    <option value="competitivo">Tutti contro Tutti</option>
                    <option value="a squadre">A Squadre</option>
                </select>
            </div>

            <div className="mb-4 ">
                <label htmlFor="s_complex"
                       className="block mb-1 text-sm font-medium text-[#b7e4c7]">Complessità:</label>
                <select multiple id="s_complex"
                        className=" h-[11em] w-full p-2 rounded bg-[#2d3e33] text-white border border-[#3a5244] focus:outline-none focus:ring-2 focus:ring-[#95d5b2]">
                    <option value="">Qualunque</option>
                    <option value="Facilissimo">Facilissimo</option>
                    <option value="Facile">Facile</option>
                    <option value="Medio">Medio</option>
                    <option value="Difficile">Difficile</option>
                    <option value="Molto complesso">Molto Complesso</option>
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="s_time" className="block mb-1 text-sm font-medium text-[#b7e4c7]">Durata: </label>
                <select multiple id="s_time"
                        className="h-[11em] w-full p-2 rounded bg-[#2d3e33] text-white border border-[#3a5244] focus:outline-none focus:ring-2 focus:ring-[#95d5b2] custom-scroll">
                    <option value="">Qualunque</option>
                    <option value="Molto breve">Molto breve</option>
                    <option value="Breve">Breve</option>
                    <option value="Medio">Medio</option>
                    <option value="Lungo">Lungo</option>
                    <option value="Molto lungo">Molto lungo</option>
                </select>
            </div>

            <div className="mb-4">
                <label htmlFor="style" className="block mb-1 text-sm font-medium text-[#b7e4c7]">New Select:</label>
                <div id="style"
                     className="w-full p-2 rounded bg-[#2d3e33] text-white border border-[#3a5244] space-y-2">
                    <label className="flex items-center space-x-2">
                        <input type="checkbox" value="Scotland Yard"/>
                        <span>Scotland Yard</span>
                    </label>

                    <label className="flex items-center space-x-2">
                        <input type="checkbox" value="Piazzamento Lavoratori"/>
                        <span>Piazzamento Lavoratori</span>
                    </label>

                    <label className="flex items-center space-x-2">
                        <input type="checkbox" value="Gestionale"/>
                        <span>Gestionale</span>
                    </label>

                    <label className="flex items-center space-x-2">
                        <input type="checkbox" value="Deduzione Sociale"/>
                        <span>Deduzione Sociale</span>
                    </label>

                    <label className="flex items-center space-x-2">
                        <input type="checkbox" value="Deduzione Sociale"/>
                        <span>Deduzione Sociale</span>
                    </label>

                    <label className="flex items-center space-x-2">
                        <input type="checkbox" value="Deduzione Sociale"/>
                        <span>Deduzione Sociale</span>
                    </label>
                </div>
            </div>
        </div>
    </div>
}

function OpenCloseButton() {
    function toggleSidebar() {
    }

    return <div id="buttonwrap" className="relative top-6 md:left-0 left-60">
        <button id="sidebar-toggle" onClick={() => toggleSidebar()}
                className="sticky top-32 h-12  p-3 cicckalo bg-[#2d3e33] hover:bg-[#3e5544] text-white rounded-r rotate-180">
            ➤
        </button>
    </div>
}


function MainTable({PromiseSheetData}: { PromiseSheetData: Promise<string[][]> }) {
    return <main id="mainContent" className="z-1 main  flex-1 -ml-11 md:ml-4  p-4 md:p-16 transition-all duration-300">
        <h1 className="m-10 text-4xl font-bold text-[#b7e4c7] z-2"> Ricerca dei giochi </h1>

        <div className="overflow-x-auto bg-[#1b2a21] rounded-xl shadow-md">
            <table id="tabella_giochi" className="min-w-full table-auto">
                {/*<thead className="bg-[#2a3c30] text-[#b7e4c7]">*/}
                {/*<tr>*/}
                {/*    <th className="text-left px-6 py-4">Game</th>*/}
                {/*    <th className="text-left px-6 py-4">Min</th>*/}
                {/*    <th className="text-left px-6 py-4">Max</th>*/}
                {/*    <th className="text-left px-6 py-4">Competizione</th>*/}
                {/*    <th className="text-left px-6 py-4">Difficoltà</th>*/}
                {/*    <th className="text-left px-6 py-4">Tempo</th>*/}
                {/*</tr>*/}
                {/*</thead>*/}
                <TableBody PromiseSheetData={PromiseSheetData}/>
            </table>
        </div>
    </main>
}

function TableBody({PromiseSheetData}: { PromiseSheetData: Promise<string[][]> }) {


    const [rows, setRows] = React.useState<jsonGame[]>([]);
    // const [columns, setColumns] = React.useState<string[]>([]);
    const columns = ['Titolo', 'Gioc Min', 'Gioc Max', 'Competizione', 'Difficoltà', 'Durata'] as (keyof jsonGame)[];

    React.useEffect(() => {
        PromiseSheetData.then(array => dbHandler(array)).then(games => {
            // let a = dfd.toJSON(games);
            setRows(games);
            // setColumns(Object.keys(games));
        });
    }, [PromiseSheetData]);

    if (rows.length === 0) {
        return <tbody>
        <tr>
            <td colSpan={columns.length}>Caricamento...</td>
        </tr>
        </tbody>;
    }
    return <tbody className="text-[#e1e1e1]">
    {rows.map((row, index) => (<TableRow rowData={row} columns={columns} isEven={index % 2 === 1}/>))}
    </tbody>;
}

type TableRowProps = {
    rowData: jsonGame; columns: (keyof jsonGame)[]; isEven: boolean;
};


function TableRow({rowData, columns, isEven}: TableRowProps) {
    const isMediumScreen = window.matchMedia("(min-width: 768px)").matches;

    return <>
        <tr className={`${isEven ? "greenD" : "green-DD"} cursor-pointer hover:bg-[#36543f] transition-colors`}>
            <td className="px-2 md:px-4 py-2 flex items-center gap-3">
                <div className="w-12 flex-o-center">
                    <img src={rowData.LinkImmagine} className="h-12 rounded shadow" alt=''/></div>
            </td>
            <td className="text-center md:px-4 py-3">
                <span className="font-semibold px-2">{rowData.Titolo}</span>
            </td>
            <td className="text-center py-3">{rowData["Gioc Min"]}</td>
            <td className="text-center py-3">{rowData["Gioc Max"]}</td>
            {isMediumScreen && (
                <>
                    <td className="text-center px-2 py-3">{rowData.Competizione}</td>
                    <td className="text-center px-2 py-3">{rowData.Difficoltà}</td>
                    <td className="text-center px-4 py-3">{rowData.Durata}</td>
                </>
            )}
            <td className='text-center px-3 py-3 w-10'>
                {/*TODO QUI AGGIUNGERE MODALE PER CAPIRE*/}
                {/*<button onClick={()=>showInfoModal(rowData)}*/}
                {/*    className={"text-[#1f3127] bg-yellow-400 hover:bg-yellow-600 hover:text-white font-bold rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-md transition"}>*/}
                {/*    */}
                {/*</button>*/}
            </td>
        </tr>
    </>
}

function InfoModal() {
    return <div id="popup-blur"
         className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 opacity-0 pointer-events-none transition-opacity duration-500">
        <div id="popup-outer"
             className="bg-yellow-100 text-black rounded-lg p-[10%] md:py-20 max-w-[90%] relative transform scale-95 transition-transform duration-300">
            <button onClick={() => closeInfoModal()} className="absolute top-2 right-2 text-xl font-bold">&times;</button>
            <div id="popup-inner">
            </div>
        </div>
    </div>
}