import React from 'react';
import { useState } from "react";

function HomeView() {
    return <div className='flex bg-green-100'>
          <h1>Welcome to the Home View</h1>
         <p>This is the main content of the home view.</p>
         <p>fuck off</p>
         </div>;
};


function TableView() {
    return <div className='m-4'>
          <h2 className='text-lg'>This is a table</h2>
         <p>Lorem ipsum sit dolor.</p>
         </div>;
};
//
type NavigatorProps = {
  setPage: (page: "home" | "table") => void;
};


function Navigator({setPage}: NavigatorProps) {
return <div className="flex gap-4 p-4 bg-gray-200">
        <button className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setPage("home")}>
          Home
        </button>

        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
        onClick={() => setPage('table')}>
          Table
        </button>
      </div>;
      }

function ProvaArgomento(props:{value:number}) {
return
    <div className='bg-red-500'>
    <p>This is navigation with value {props.value}</p></div>
};

export default function App() {
const [page, setPage] = useState('home');
return <div className='text-black'>
        <Navigator setPage={setPage}/>
        {page === "home" && <HomeView />}
        {page === "table" && <TableView />}
        </div>;
};

function handleClick() {
  setPage('table');
  console.log(page);
};