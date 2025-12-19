import './style/style.css';
import './style/home-style.css';
import {load_game_counter} from './scripts/homepage/onload';
import {createNav} from "./scripts/navbar";
import { makeHomeView } from './views/home.view';
import { renderView, getElementById } from './utils/view.utils';

function init() {
    const radice = getElementById('radice')
    const homeView = makeHomeView();
    renderView(homeView);
}

init();
load_game_counter();
createNav('link-home');