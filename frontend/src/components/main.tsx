import React from 'react';
import HomeView from './views/homeView/homeView';
import TableView from './views/tableView';
import ContributeView from './views/contributeView';


export default function App() {
    const [page, setPage] = React.useState('home');

    return <div className='text-black'>
        {page === "home" && <HomeView setPage={setPage}/>}
        {page === "table" && <TableView setPage={setPage}/>}
        {page === "contribute" && <ContributeView setPage={setPage}/>}
    </div>;
};