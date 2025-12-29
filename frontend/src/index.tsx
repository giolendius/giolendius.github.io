import React from 'react';
import { createRoot } from "react-dom/client";

import './style/style.css';
import './style/home-style.css';

import App from './components/main';


const radice = document.getElementById('root')!
const root = createRoot(radice)


root.render(<App />);
// load_game_counter();
// createNav('link-home');