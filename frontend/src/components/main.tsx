import React from 'react';
import HomeView from './views/homeView/homeView';
import TableView from './views/tableView/tableView';
import ContributeView from './views/contributeView';
import fetchSheet from "./utils/fetchSheet";
import {SheetData} from "./utils/types";
import {defineUserInputsStates, userInputs} from "./views/tableView/SideBar";
import {NewNavbar} from "./navbar";

export default function App() {
    let PromiseSheetData: Promise<SheetData> = fetchSheet()

    return <div className='text-black'>
        <ThreeViews PromiseSheetData={PromiseSheetData}/>
    </div>;
};


function ThreeViews({PromiseSheetData}: { PromiseSheetData: Promise<SheetData> }) {
    const [page, setPage] = React.useState('table');
    const userInputs: userInputs = defineUserInputsStates();
    return <>
        {page === "home" && <HomeView setPage={setPage} PromiseSheetData={PromiseSheetData}>
            <NewNavbar setPage={setPage} activeLinkName={'home'}/></HomeView>}
        {page === "table" && <TableView PromiseSheetData={PromiseSheetData} userInputs={userInputs}>
            <NewNavbar setPage={setPage} activeLinkName={'table'}/></TableView>}
        {page === "contribute" &&
            <ContributeView>
                <NewNavbar setPage={setPage} activeLinkName={'contribute'}/></ContributeView>}</>;
}