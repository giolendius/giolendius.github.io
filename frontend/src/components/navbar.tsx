import {getElementById} from "./utils/view.utils";
import {ViewNames, NavigatorArguments} from "./views/views";
import {ReactElement} from "react";


export function NewNavbar({setPage, activeLinkName}: NavigatorArguments):
    ReactElement {


    function ButtonLink(
        {DisplayText, ViewName, additionalClasses = ''}:
        { DisplayText: string, ViewName: ViewNames, additionalClasses: string }) {
        function handleClick() {
        setPage(ViewName);
        };
        return <button onClick={() => handleClick()}
                       className={`nav-link px-4 py-2 text-white text-lg relative transition duration-300 
                       ${ViewName == activeLinkName ? 'active' : ''} ${additionalClasses}`}> {DisplayText} </button>

    }

    return <div className="bg-black px-4 py-6 my-flex-wrap switch">
        <div className="backdrop-blur-md rounded-lg border border-white/30 flex m-8">
            <ButtonLink DisplayText={'Home'} ViewName={'home'} additionalClasses={'rounded-l-lg'}/>
            <ButtonLink DisplayText={'Ricerca'} ViewName={'table'} additionalClasses={''}/>
            <ButtonLink DisplayText={'Contribuisci'} ViewName={'contribute'} additionalClasses={'rounded-r-lg'}/>
        </div>
        <div className="flex items-center bg-[#1e2d24] rounded-full p-2 m-4 border-2 border-[#b7e4c7]">
            <div className="bg-[#b7e4c7] ml-auto mr-2 rounded-full p-1">
                <img id="meeple" src="../img/3d-meeple-svgrepo-com.svg" alt="meeple"
                     className="w-12"/>
            </div>
            <h1 className="text-4xl pb-2 font-bold text-[#b7e4c7]">Great Gallo Games</h1>
        </div>
    </div>
}


function createNav(activeLinkName: ViewNames) {
    const headerHTML = `
        <div class="bg-black px-4 py-6 my-flex-wrap switch">
          <div class="backdrop-blur-md rounded-lg border border-white/30 flex m-8">
                <a id="link-home" href="/home_page.html"
                   class="rounded-l-lg nav-link px-4 py-2 text-white text-lg relative transition duration-300"> Home</a>
                <a id="link-table" href="/html/table.html"
                   class="nav-link px-4 py-2 text-white text-lg relative transition duration-300"> Cerca </a>
                <a id="link-contribuisci" href="/html/modify_source.html"
                   class="rounded-r-lg nav-link px-4 py-2 text-white text-lg relative transition duration-300"> Contribuisci </a>
            </div>
            <div class="flex items-center bg-[#1e2d24] rounded-full p-2 m-4 border-2 border-[#b7e4c7]">
                <div class="bg-[#b7e4c7] ml-auto mr-2 rounded-full p-1">
                <img id="meeple" src="../img/3d-meeple-svgrepo-com.svg" alt="meeple"
                                                                             class="w-12"></div>
                <h1 class="text-4xl pb-2 font-bold text-[#b7e4c7]">Great Gallo Games</h1>
            </div>
        
        </div>`;
    const div = getElementById('linkToPages');
    div.innerHTML = headerHTML
    console.log(`Navbar created with active link: ${activeLinkName}`);
    const activeLink = document.getElementById(activeLinkName);
    if (activeLink) {
        activeLink.classList.add("active");
    }
}