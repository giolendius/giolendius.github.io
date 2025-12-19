import './style/style.css';
import './style/home-style.css';
import {load_game_counter} from './scripts/homepage/onload';
import {createNav} from "./scripts/navbar";
import { makeHomeView } from './views/home.view';
import { renderView } from './utils/view.utils';

function init() {
    const radice = document.getElementById('radice')
    if (radice) {
        radice.textContent = 'Learning vite is cool'
    }
    const homeView = makeHomeView();
    renderView(homeView);
}

init();
load_game_counter();
createNav('link-home');