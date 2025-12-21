import './style/style.css';
import './style/home-style.css';
import {load_game_counter} from './scripts/homepage/onload';
import {createNav} from "./scripts/navbar";
import Cazzo from './views/home.view';
import { renderView, getElementById } from './utils/view.utils';
import React from 'react';
import { createRoot } from "react-dom/client";

const radice = getElementById('radice')
const root = createRoot(radice)
root.render(<Cazzo />);

load_game_counter();
createNav('link-home');