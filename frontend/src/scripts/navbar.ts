import {NavLinkName} from "../utils/types";

export function createNav(activeLinkName: NavLinkName) {
    const headerHTML = `
        <div class="bg-black px-4 py-6 my-flex-wrap switch">
          <div class="backdrop-blur-md rounded-lg border border-white/30 flex m-8">
                <a id="link-home" href="/index.html"
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
    const div = document.getElementById('linkToPages');
    if (div) {
        div.innerHTML = headerHTML
    }
    // document.write(headerHTML);
    console.log(`Navbar created with active link: ${activeLinkName}`);
    const activeLink = document.getElementById(activeLinkName);
    if (activeLink) {
        activeLink.classList.add("active");
    }
}

