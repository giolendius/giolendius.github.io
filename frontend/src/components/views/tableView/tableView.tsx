import React from 'react';
import {dbHandler} from "./dbHandler";
import {GameItem} from "./gameType";
import {SheetData} from "../../utils/types";
import {isMediumScreen} from "../../utils/utils";
import '../../../style/table-style.css';
import {Sidebar, userInputs} from "./SideBar";


type TableViewProps = {
    PromiseSheetData: Promise<SheetData>, userInputs: userInputs, children?: React.ReactNode
};

export default function TableView({PromiseSheetData, userInputs, children}: TableViewProps) {

    const [rows, setRows] = React.useState<GameItem[] | null>(null);
    const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(true);
    // const [columns, setColumns] = React.useState<string[]>([]);
    const columns = ['Titolo', 'Gioc Min', 'Gioc Max', 'Competizione', 'Difficoltà', 'Durata'] as (keyof GameItem)[];
    const [selectedGame, setSelectedGame] = React.useState<GameItem | null>(null);

    React.useEffect(() => {
            dbHandler(PromiseSheetData, userInputs, setRows);
        },
        [userInputs]
    )
    ;

    return <div>
        {/*navigator*/}
        {children}
        <div className="bg-black relative flex transition-all duration-300">
            {/*w-[100vw] max-w-[88rem] */}
            <div id="sidebarWrapper"
                 className={`bg-[#121212] md:bg-black md:relative absolute top-0 left-0 w-[100vw] max-w-[88rem] 
                 h-full py-2 transition-all duration-300 ${!sidebarOpen && 'collapsed'}`}>
                <Sidebar userInputs={userInputs}/>
            </div>
            <OpenCloseButton sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
            {(isMediumScreen || !sidebarOpen) && <MainTableArea>
                <tbody className="text-[#e1e1e1]">
                <TableBody
                    rows={rows}
                    columns={columns}
                    showGame={setSelectedGame}
                />
                </tbody>
            </MainTableArea>}
            {selectedGame && <InfoPopUp
                gameItem={selectedGame}
                onClose={() => setSelectedGame(null)}
            />}
        </div>
    </div>
}

function OpenCloseButton({sidebarOpen, setSidebarOpen}: {
    sidebarOpen: boolean,
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {

    return <div id="buttonwrap" className={`relative top-6 md:left-0 ${sidebarOpen ? 'left-60' : ''}`}>
        <button id="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`sticky top-32 h-12  p-3 cicckalo bg-[#2d3e33] hover:bg-[#3e5544] text-white rounded-r ${sidebarOpen ? 'rotate-180' : ''}`}>
            ➤
        </button>
    </div>
}


function MainTableArea({children}: { children: React.ReactNode }) {
    return <main id="mainContent"
                 className="z-1 main  flex-1 -ml-11 md:ml-4  p-4 md:p-16 transition-all duration-300">
        <div className={'text-[#b7e4c7]'}>
            <p>Molto breve: 10 minuti e abbiamo finito!</p>
            <p>Breve: 30 o 45 minuti</p>
            <p>Medio: circa 1h30m</p>
            <p>Lungo: fino a 3h di gioco</p>
            <p>Molto Lungo: oltre le 3h di gioco</p>
        </div>
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
    showGame: showGame,
    columns: (keyof GameItem)[]
}) {
    console.log('rows are', rows)

    if (rows?.length === 0) {
        return <tr>
            <td className={'text-center p-4'} colSpan={columns.length}> Nessun risultato trovato</td>
        </tr>;
    }
    if (!rows) {
        console.log('adadadwawd')
        return <tr>
            <td className={'text-center p-2'} colSpan={columns.length}>Caricamento....</td>
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

type showGame = (e: GameItem) => void;

type TableRowProps = {
    rowData: GameItem;
    showGame: showGame;
    index: number;
};


function TableRow({rowData, showGame, index}: TableRowProps) {

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