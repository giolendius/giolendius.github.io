import React from 'react';
import {NewNavbar} from "../navbar";
import {setPageT} from "./views";


export default function TableView({setPage}: { setPage: setPageT }) {
    return <div>
        <NewNavbar setPage={setPage} activeLinkName={'table'}/>
        <div className='flex bg-green-100'>
            <h1>here lies the table </h1>
            <p>This is the main content of the table.</p>
        </div>
    </div>
}