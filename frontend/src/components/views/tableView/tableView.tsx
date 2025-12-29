import React from 'react';
import {NewNavbar} from "../../navbar";
import {setPageT} from "../views";
import {dbHandler} from "./dbHandler";
import {GameItem} from "./gameType";
import {SheetData} from "../../utils/types";
import '../../../style/table-style.css';
import {Sidebar, userInputs} from "./SideBar";


type TableViewProps = {
    setPage: setPageT; PromiseSheetData: Promise<SheetData>, userInputs: userInputs
};

export default function TableView({setPage, PromiseSheetData, userInputs}: TableViewProps) {

    const [rows, setRows] = React.useState<GameItem[] | null>(null);
    // const [columns, setColumns] = React.useState<string[]>([]);
    const columns = ['Titolo', 'Gioc Min', 'Gioc Max', 'Competizione', 'Difficoltà', 'Durata'] as (keyof GameItem)[];
    const [selectedGame, setSelectedGame] = React.useState<GameItem | null>(null);


    // React.useEffect(() => {
    //     PromiseSheetData.then(array => dbHandler(array, userInputs)).then(games => {
    //         // let a = dfd.toJSON(games);
    //         setRows(games);
    //         // setColumns(Object.keys(games));
    //     });
    // }, [userInputs]);
    React.useEffect(() => {
            dbHandler(PromiseSheetData, userInputs, setRows);
        },
        [userInputs]
    )
    ;

    return <div>
        <NewNavbar setPage={setPage} activeLinkName={'table'}/>
        <div className={`bg-red-500`}>Ciaooooooo
            testo è {userInputs.search.curValue}
            pl={userInputs.players.curValue}
            diff={userInputs.complexity.curValue}
            categ sono {userInputs.categ.curValue.length} invece array
            è {['ciao', 'amico ', 'caro  !'].length}</div>
        <div className="bg-black relative flex transition-all duration-300">

            <Sidebar userInputs={userInputs}/>
            <OpenCloseButton/>
            <MainTable>
                <tbody className="text-[#e1e1e1]">
                <TableBody
                    rows={rows}
                    columns={columns}
                    showGame={setSelectedGame}
                />
                </tbody>
            </MainTable>
            {selectedGame && <InfoPopUp
                gameItem={selectedGame}
                onClose={() => setSelectedGame(null)}
            />}
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


function MainTable({children}: { children: React.ReactNode }) {
    return <main id="mainContent"
                 className="z-1 main  flex-1 -ml-11 md:ml-4  p-4 md:p-16 transition-all duration-300">
        <h1 className="m-10 text-4xl font-bold text-[#b7e4c7] z-2"> Ricerca dei giochi </h1>
        <div className="overflow-x-auto bg-[#1b2a21] rounded-xl shadow-md">
            <table id="tabella_giochi" className="min-w-full table-auto">
                {children}
            </table>
        </div>
    </main>
}

function TableBody({rows, showGame, columns}: {
    rows: GameItem[] | null,
    showGame: showGameT,
    columns: (keyof GameItem)[]
}) {
    console.log('rows are', rows)

    if (rows?.length === 0) {
        return <tr>
            <td colSpan={columns.length}> Nessun risultato trovato...</td>
        </tr>;
    }
    if (!rows) {
        console.log('adadadwawd')
        return <tr>
            <td colSpan={columns.length}>Caricamento...</td>
        </tr>
            ;
    }


    return <>
        {rows.map((row, index) => (
            <TableRow rowData={row}
                      index={index}
                      showGame={showGame}/>
        ))}
    </>
}

type showGameT = (e: GameItem) => void;

type TableRowProps = {
    rowData: GameItem;
    showGame: showGameT;
    index: number;
};


function TableRow({rowData, showGame, index}: TableRowProps) {
    const isMediumScreen = window.matchMedia("(min-width: 768px)").matches;

    return <>
        <tr key={index}
            className={`${index % 2 === 1 ? "greenD" : "greenDD"} cursor-pointer hover-lighten transition-colors`}>
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
                <button onClick={() => showGame(rowData)}
                        className={"text-[#1f3127] bg-yellow-400 hover:bg-yellow-600 hover:text-white font-bold rounded-full w-10 h-10 flex items-center justify-center text-xl shadow-md transition"}>
                    ?
                </button>
            </td>
        </tr>
    </>
}

function InfoPopUp({gameItem, onClose}: { gameItem: GameItem; onClose: () => void }) {
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        setTimeout(() => setShow(true), 10); // trigger animazione dopo mount
    }, []);

    function onCloseHandler() {
        setShow(false);
        setTimeout(onClose, 200);
    }

    return <>
        <div id="popup-blur" onClick={onCloseHandler}
             className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity duration-500">
            <div id="popup-outer" onClick={(e) => e.stopPropagation()}
                 className=
                     {`bg-yellow-100 text-black rounded-lg p-[5%] md:py-20 max-w-[90%] relative transform transition-transform duration-300 ${show ? "scale-100" : "scale-25"}`}>
                <button onClick={onCloseHandler}
                        className="absolute top-2 right-2 text-xl font-bold">&times;</button>
                <div id="popup-inner">
                    <img src={gameItem.LinkImmagine !== "" ? gameItem.LinkImmagine : undefined} alt=" "
                         className="mx-auto mb-4 rounded-lg shadow-lg w-auto max-h-48 md:max-h-80 object-cover"/>
                    <h2 className={'text-3xl font-bold text-center mb-4 text-[#95d5b2]'}>{gameItem.Titolo}</h2>
                    <div className="space-y-2 text-center text-base">
                        {Object.entries(gameItem)
                            .filter(([key]) => ["Gioc Min", "Gioc Max", "Competizione", "Difficoltà", "Durata",].includes(key))
                            .map(([key, value]) => (
                                <p key={key}><b>{key}:</b> {String(value)}</p>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    </>
}