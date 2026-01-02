import {ViewNames, setPageT} from "./views/views";
import {ReactElement} from "react";
import meeple from "../img/3d-meeple-svgrepo-com.svg";

export type NavigatorProps = {
    setPage: setPageT;
    activeLinkName: ViewNames;
}

export function NewNavbar({setPage, activeLinkName}: NavigatorProps): ReactElement {

    function ButtonLink(
        {DisplayText, ViewName, additionalClasses = ''}:
        { DisplayText: string, ViewName: ViewNames, additionalClasses: string }) {
        function handleClick() {
        setPage(ViewName);
        }
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
                <img id="meeple" src={meeple} alt="meeple"
                     className="w-12"/>
            </div>
            <h1 className="text-4xl pb-2 font-bold text-[#b7e4c7]">Great Gallo Games</h1>
        </div>
    </div>
}