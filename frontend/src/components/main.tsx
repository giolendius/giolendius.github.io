import React from 'react';
import HomeView from './views/homeView/homeView';
import TableView from './views/tableView/tableView';
import ContributeView from './views/contributeView';
import {defineUserInputsStates, userInputs} from "./views/tableView/SideBar";
import {NewNavbar} from "./navbar";
import {createDb, dataframe} from "./views/tableView/createDb";
import {ViewNames} from "./views/views";

export default function App() {

    const promiseDb = createDb();

    return <div className='text-black'>
        <ThreeViews promiseDb={promiseDb}/>
    </div>;
};


function ThreeViews({promiseDb}: { promiseDb: Promise<dataframe> }) {
    const [page, setPage] = React.useState<ViewNames>('home');
    const userInputs: userInputs = defineUserInputsStates();
    return <>
        {page === "home" &&
            <HomeView setPage={setPage} promiseDb={promiseDb}><NewNavbar setPage={setPage} activeLinkName={'home'}/></HomeView>}
        {page === "table" &&
            <TableView promiseDb={promiseDb} userInputs={userInputs}><NewNavbar setPage={setPage} activeLinkName={'table'}/></TableView>}
        {page === "contribute" &&
            <ContributeView><NewNavbar setPage={setPage} activeLinkName={'contribute'}/></ContributeView>}
    </>;}