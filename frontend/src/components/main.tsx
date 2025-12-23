import React from 'react';
import HomeView from './views/homeView/homeView';
import TableView from './views/tableView/tableView';
import ContributeView from './views/contributeView';
import fetchSheet from "./utils/fetchSheet";


export default function App() {
    const [page, setPage] = React.useState('table');
    let SheetData = fetchSheet()

    return <MioContext.Provider value={'ciao'}>
    <div className='text-black'>
        {page === "home" && <HomeView setPage={setPage}/>}
        {page === "table" && <TableView setPage={setPage} PromiseSheetData={SheetData}/>}
        {page === "contribute" && <ContributeView setPage={setPage}/>}
    </div></MioContext.Provider>;
};

const MioContext = React.createContext('ciao');
export const NonCapisco = () => React.useContext(MioContext)