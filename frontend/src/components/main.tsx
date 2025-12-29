import React from 'react';
import HomeView from './views/homeView/homeView';
import TableView from './views/tableView/tableView';
import ContributeView from './views/contributeView';
import fetchSheet from "./utils/fetchSheet";
import {SheetData} from "./utils/types";
import {defineUserInputsStates, userInputs} from "./views/tableView/SideBar";

export default function App() {
    let PromiseSheetData: Promise<SheetData> = fetchSheet()

    return <div className='text-black'>
        <ThreeViews PromiseSheetData={PromiseSheetData}/>
    </div>;
};


function ThreeViews({PromiseSheetData}:{PromiseSheetData:Promise<SheetData>}) {
    const [page, setPage] = React.useState('table');
    const userInputs: userInputs = defineUserInputsStates();
    return <>{page === "home" && <HomeView setPage={setPage}/>}
        {page === "table" && <TableView setPage={setPage} PromiseSheetData={PromiseSheetData} userInputs={userInputs}/>}
        {page === "contribute" && <ContributeView setPage={setPage}/>}</>;
}