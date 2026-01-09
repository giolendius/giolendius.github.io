import React from 'react';
import {dataframe, filterDb} from "./createDb";
import {GameItem, ItalianSheetColumnNames} from "./gameType";
import {isMediumScreen} from "../../utils/utils";
import '../../../style/table-style.css';
import {Sidebar, userInputs} from "./SideBar";
import {columnNames} from "../../utils/column_names";
import {toJSON} from "danfojs";


type TableViewProps = {
    promiseDb: Promise<dataframe>, userInputs: userInputs, children?: React.ReactNode
};

export default function TableView({promiseDb, userInputs, children}: TableViewProps) {

    const [rows, setRows] = React.useState<GameItem[] | null>(null);
    const [sidebarOpen, setSidebarOpen] = React.useState<boolean>(true);
    // const [columns, setColumns] = React.useState<string[]>([]);
    const columns = ['Titolo', 'Gioc Min', 'Gioc Max', 'Competizione', 'Difficoltà', 'Durata'] as (keyof GameItem)[];
    const [selectedGame, setSelectedGame] = React.useState<GameItem | null>(null);

    React.useEffect(() => {
            promiseDb.then((db: dataframe) => filterDb(db, userInputs, setRows));
        },
        [userInputs]);
    const mainRef = React.useRef<HTMLDivElement>(null!);
    const scrollToMain = () => {

        mainRef.current?.scrollTo({ //this scrolls the referenced div at its top
            top: 0,
            behavior: "smooth"
        });
    }

    setTimeout(() => {
        mainRef.current?.scrollIntoView({ //this scroll the windows at the start of ref
            behavior: "smooth",
            block: 'start'
        })
    }, 1000);
    const sidebarWidthRem = 128


    return <div>
        { /*navigator*/ children}
        <main className={`bg-black takes-all-screen ${selectedGame ? 'locked' : ''}`}>
            <div></div>
            <OpenCloseButton sidebarOpen={sidebarOpen}
                             setSidebarOpen={setSidebarOpen}
                             sidebarWidth={sidebarWidthRem}/>
            <aside className={`my-sidebar ${sidebarOpen ? "open" : "closed"}`}
                   style={{maxWidth: sidebarWidthRem * 4}}>
                <Sidebar userInputs={userInputs}/>
            </aside>

            <MainTableArea refer={mainRef}>
                <tbody className="text-[#e1e1e1]">
                <TableBody
                    rows={rows}
                    columns={columns}
                    showGame={setSelectedGame}
                />
                </tbody>
            </MainTableArea>
            <div>
                <button id="backToTop"
                        onClick={scrollToMain}
                        className="fixed bottom-0 right-0 w-[18vw] h-[12vw] p-2  bg-[#b7e4c7] hover:bg-yellow-200 text-white rounded-tl-[10vw] shadow-lg text-4xl">
                    ↑⇧⮝⮭
                </button>
            </div>
        </main>
        {selectedGame && <InfoPopUp
            gameItem={selectedGame}
            PromiseDb={promiseDb}
            setSelectedGame={setSelectedGame}
        />}
        {/*<footer className={"greenDDD"}>This contains text <h1>and a title </h1></footer>*/}
    </div>
}

function OpenCloseButton({sidebarOpen, setSidebarOpen, sidebarWidth}: {
    sidebarOpen: boolean,
    setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>,
    sidebarWidth: number
}) {
    const buttonDistance = Math.min((window.innerWidth), sidebarWidth * 4) - 80;
    return <>
        {/*<div id="buttonwrap" className={`relative top-6 md:left-0 ${sidebarOpen ? 'left-60' : ''}`}>*/}
        <div className='bg-green-200 sticky top-9 z-3'>
            <button id="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={`absolute p-3 bg-[#2d3e33] hover:bg-[#3e5544] text-white rounded-r 
                ${sidebarOpen ? `rotate-180` : ''}`}
                    style={{left: sidebarOpen ? `${buttonDistance}px` : '20px'}}>
                ➤
            </button>
        </div>
    </>
}


function MainTableArea({children, refer}: { children: React.ReactNode, refer: React.RefObject<HTMLDivElement> }) {
    const [showLegend, setShowLegend] = React.useState(false);
    return <main ref={refer} id="mainContent"
                 className="z-1 main flex-1  p-4 md:p-16 transition-all duration-300">
        <div className={'text-[#b7e4c7] flex-o-center'}>
            <h1 className="m-10 text-4xl font-bold text-[#b7e4c7]"> Ricerca dei giochi </h1>
            <button
                onMouseEnter={() => setShowLegend(true)}
                className="w-6 h-6 rounded-full border-2 border-white text-white flex items-center justify-center text-sm hover:bg-white hover:text-black transition">
                i
            </button>
        </div>
        {showLegend && (
            <div onMouseLeave={() => setShowLegend(false)}
                 className="absolute right-8 top-0 p-10 greenLL text-black rounded-xl shadow-lg whitespace-nowrap z-10">
                <p>Molto breve: 10 minuti e abbiamo finito!</p>
                <p>Breve: 30 o 45 minuti</p>
                <p>Medio: circa 1h30m</p>
                <p>Lungo: fino a 3h di gioco</p>
                <p>Molto Lungo: oltre le 3h di gioco</p>
            </div>)}
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
    if (rows?.length === 0) {
        return <tr>
            <td className={'text-center p-4'} colSpan={columns.length}> Nessun risultato trovato</td>
        </tr>;
    }
    if (!rows) {
        return <tr>
            <td className={'text-center p-2'} colSpan={columns.length}>Caricamento....</td>
        </tr>
            ;
    }


    return <>
        {rows.map((row, index) => (
            <TableRow key={row[columnNames.TITLE]}
                      rowData={row}
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
        <tr className={`${index % 2 === 1 ? "greenD" : "greenDD"} cursor-pointer hover-lighten transition-colors`}>
            <td className="px-2 md:px-4 py-2 flex items-center gap-3">
                <div className="w-12 flex-o-center">
                    <img src={`${rowData.LinkImmagine ? rowData.LinkImmagine : null}`} className="h-12 rounded shadow"
                         alt=''/></div>
            </td>
            <td className="text-center md:px-4 py-3">
                <span className="font-semibold px-2">{rowData[columnNames.TITLE]}</span>
            </td>
            <td className="text-center py-3">{rowData[columnNames.PLAYERS_MIN]}</td>
            <td className="text-center py-3">{rowData[columnNames.PLAYERS_MAX]}</td>
            {isMediumScreen && (
                <>
                    <td className="text-center px-2 py-3">{rowData[columnNames.COMPETITION_CAT]}</td>
                    <td className="text-center px-2 py-3">{rowData[columnNames.DIFFICULTY_CAT]}</td>
                    <td className="text-center px-4 py-3">{rowData[columnNames.DURATION_CAT]}</td>
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

function InfoPopUp({gameItem, PromiseDb, setSelectedGame}: {
    gameItem: GameItem;
    PromiseDb: Promise<dataframe>,
    setSelectedGame: React.Dispatch<React.SetStateAction<GameItem | null>>
}) {
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        setTimeout(() => setShow(true), 10); // trigger animazione dopo mount
    }, []);

    function onCloseHandler() {
        setShow(false);
        setTimeout(() => {
            setSelectedGame(null)
        }, 200);
    }

    const LinkBGG: string = gameItem[columnNames.LINK_BGG];

    function Casella({children, field, label}: {
        children?: React.ReactNode,
        field?: ItalianSheetColumnNames,
        label?: string
    }) {
        let content: React.ReactNode = null;

        if (children) {
            content = children
        } else if (field && gameItem[field] !== '') {
            content = <p><b>{label}</b>{gameItem[field]}</p>
        } else if (!field || gameItem[field] === '') {
            content = null
        } else {
            throw field as string + ' non trovato'
        }

        if (!content) return <></>;
        return <div className={' rounded-xl greenLL min-w-fit p-2'}>{content}</div>;

    }

    return <>
        <div id="popup-blur" onClick={onCloseHandler}
             className="fixed inset-0 flex items-center w-screen h-screen justify-center  z-50 backdrop-blur-sm transition-opacity duration-500 over">
            <div id="popup-outer" onClick={(e) => e.stopPropagation()}
                 className=
                     {`greenM text-black rounded-lg  p-[5%] md:py-20 
                     max-w-4/5 max-h-9/10 overflow-y-auto transform transition-transform duration-300 
                     ${show ? "scale-100" : "scale-25"}`}>
                <button onClick={onCloseHandler}
                        className="absolute top-2 right-2 text-xl font-bold">&times;</button>
                <div id="popup-inner">
                    <img src={gameItem.LinkImmagine !== "" ? gameItem.LinkImmagine : undefined} alt=" "
                         className="mx-auto mb-4 rounded-lg max-h-48 md:max-h-80 object-cover p-8 orangeLL"/>
                    <h2 className={'text-3xl font-bold text-center mb-4 text-[#95d5b2]'}>
                        {LinkBGG ? <a href={LinkBGG} target="_blank" rel="noopener noreferrer" className={'underline'}>
                            {gameItem.Titolo}</a> : gameItem.Titolo}
                    </h2>
                    <hr className="border-t-0 my-4"/>
                    <div className={'flex-o-center flex-wrap gap-8 text-center text-base'}>
                        <Casella>
                            <p>{gameItem[columnNames.PLAYERS_MIN]}-{gameItem[columnNames.PLAYERS_MAX]} giocatori</p>
                        </Casella>
                        <Casella field={columnNames.PLAYERS_RECOMMENDED}></Casella>
                        <Casella field={columnNames.PLAYERS_BEST}></Casella>
                        <Casella field={columnNames.DURATION_CAT} label={'Durata: '}></Casella>
                        <Casella field={columnNames.DIFFICULTY_CAT} label={'Difficoltà: '}></Casella>
                        <Casella field={columnNames.COMPETITION_CAT} label={'Competizione: '}/>
                        <Casella field={columnNames.YEAR} label={'Anno: '}/>
                        <Casella field={columnNames.AUTHORS} label={'Autori: '}/>
                        <Casella field={columnNames.PUBLISHER} label={'Editore: '}/>
                        <Casella field={columnNames.PUBLISHER_IT} label={'Localizzato da: '}/>
                        <Casella field={columnNames.DIFFICULTY_WEIGHT} label={'BGG Weight: '}/>
                        <Casella field={columnNames.RANK} label={'BGG Rating: '}/>
                        <Casella field={columnNames.PLACE_CURRENT} label={'Al momento sembra essere in: '}/>
                        <Casella field={columnNames.EXPANSION} label={'expansionbiad: '}/>
                    </div>
                    <hr className="border-t-1 border-black my-8"/>
                    <div className={'flex-o-center flex-wrap gap-8 text-center text-base'}>
                        {gameItem[columnNames.TYPOLOGIES]?.split(',').map((typology, index) => (
                            <div key={index} className={' rounded-xl orangeLL min-w-fit p-2'}>
                                <p>{typology.trim()}
                                </p></div>
                        ))}
                    </div>
                    <Expansions expansionsIndices={gameItem['IndiceEspansioni'] as string}
                                PromiseDb={PromiseDb}
                                setSelectedGame={setSelectedGame}/>
                </div>
                {/*<div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci alias assumenda cumque dicta eveniet explicabo illo itaque laboriosam minima molestiae odio optio quibusdam ratione, sequi totam ullam voluptatum? Amet asperiores deserunt eius excepturi nesciunt, perferendis sequi? Ad aliquam ex, illo mollitia quas quidem rerum. Adipisci amet animi architecto aut cumque deleniti distinctio doloremque doloribus, ducimus est ipsam, iste laborum maxime nesciunt quam quasi quia quos ratione reiciendis sequi sint voluptate voluptates voluptatibus. Adipisci, dignissimos ex explicabo, incidunt ipsam maiores modi nisi porro provident recusandae tenetur vero vitae! Accusantium commodi, distinctio earum expedita incidunt laudantium numquam perferendis reiciendis repudiandae sunt ut!</div>*/}
                {/*<div className="text-red-500">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci alias assumenda cumque dicta eveniet explicabo illo itaque laboriosam minima molestiae odio optio quibusdam ratione, sequi totam ullam voluptatum? Amet asperiores deserunt eius excepturi nesciunt, perferendis sequi? Ad aliquam ex, illo mollitia quas quidem rerum. Adipisci amet animi architecto aut cumque deleniti distinctio doloremque doloribus, ducimus est ipsam, iste laborum maxime nesciunt quam quasi quia quos ratione reiciendis sequi sint voluptate voluptates voluptatibus. Adipisci, dignissimos ex explicabo, incidunt ipsam maiores modi nisi porro provident recusandae tenetur vero vitae! Accusantium commodi, distinctio earum expedita incidunt laudantium numquam perferendis reiciendis repudiandae sunt ut!</div>*/}
            </div>
        </div>
    </>
}

function Expansions({expansionsIndices, PromiseDb, setSelectedGame}:
                    {
                        expansionsIndices: string,
                        PromiseDb: Promise<dataframe>,
                        setSelectedGame: React.Dispatch<React.SetStateAction<GameItem | null>>
                    }) {
    if (expansionsIndices.trim() === '') {
        return <></>;
    }
    const [expansions, setExpansions] = React.useState<GameItem[]>([])

    React.useEffect(() => {
        PromiseDb.then((db: dataframe) => {
            const expansionArray = expansionsIndices.split(',').slice(0, -1).map(str => Number(str.trim()));
            const gameRows = db.loc({rows: expansionArray});
            const expansionsNames: GameItem[] = toJSON(gameRows) as GameItem[] //gameArray[db.columns.indexOf(columnNames.TITLE)];

            console.log('expansionsNames:', expansionsNames);
            setExpansions(expansionsNames);
        });
    }, [])

    return <>
        <hr className="border-t-1 border-black my-8"/>
        <div className={'flex-o-center flex-wrap gap-8 text-center text-base'}>
            {expansions.map((game, index) => (
                <div key={index} className={'flex-v-center rounded-xl pinkM min-w-fit p-2 cursor-pointer gap-2'}
                     onClick={() => setSelectedGame(game)}>
                    {game.LinkImmagine &&
                        <img src={game.LinkImmagine}  className="h-12 rounded shadow" alt=''/>}
                    <p>
                        {game.Titolo}
                    </p>
                </div>))}</div>
    </>
}

