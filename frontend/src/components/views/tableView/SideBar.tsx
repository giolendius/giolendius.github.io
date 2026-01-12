import React, {Dispatch, SetStateAction, useState} from "react";


const tipologie = [
    "Piazzamento Lavoratori",
    "Gestionale",
    "Social Deduction",
    "Parole",
    "EngineBuilding",
    "Asimmetrici",
    "Draft",
"Frenetici",
"Investigativi",
"Bluff",
"Roll & Write"]

type inputType = string | string[] | boolean;

interface inputStateSetter<T extends inputType, K extends string | boolean> {
    curValue: T;
    setValue: Dispatch<SetStateAction<T>>;
    inputBoxType: 'input' | 'select' | 'multiselect' | 'toggle';
    options?: K[];
    labelText: string;
}

export interface userInputs {
    search: inputStateSetter<string, string>;
    players: inputStateSetter<string, string>;
    collab: inputStateSetter<string[], string>;
    complexity: inputStateSetter<string[], string>;
    time: inputStateSetter<string[], string>;
    categ: inputStateSetter<string[], string>;
    authors: inputStateSetter<string, string>;
    publisher: inputStateSetter<string, string>;
    expansion: inputStateSetter<boolean, boolean>;
}

function createInputField(inputType: 'input' | 'select', labelText: string, options?: string[]): inputStateSetter<string, string> {
    if (inputType != 'input' && !options) {
        throw new Error("Options must be provided for select input type");
    }
    const [curValue, setValue] = useState<string>('');
    return {curValue, setValue, inputBoxType: inputType, labelText, options};
}

function createMultiselectInputField(labelText: string, options: string[]): inputStateSetter<string[], string> {
    const [curValue, setValue] = useState<string[]>([]);
    return {curValue, setValue, inputBoxType: 'multiselect', labelText, options};
}

function createToggleField(labelText: string): inputStateSetter<boolean, boolean> {
    const [curValue, setValue] = useState<boolean>(true);
    return {curValue, setValue, inputBoxType: "toggle", labelText};
}


export function defineUserInputsStates(): userInputs {
    return {
        search: createInputField('input', "Cerca ..."),
        players: createInputField('select', "Numero di Giocatori:", ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"]),
        collab: createMultiselectInputField("Cooperazione: ", ['COOPerativo', 'Tutti contro Tutti', 'A Squadre']),
        complexity: createMultiselectInputField("Complessità: ", ['Facilissimo', 'Facile', 'Medio', 'Difficile', 'Molto complesso']),
        time: createMultiselectInputField("Durata: ", ['Molto Breve', 'Breve', 'Medio', 'Lungo', 'Molto Lungo']),
        categ: createMultiselectInputField("Tipologie: ", tipologie),
        authors: createInputField('input', 'Cerca autore:'), // Example authors
        publisher: createInputField('input', 'Cerca editore:'), // Example publishers
        expansion: createToggleField('Mostra espansioni')
    }
}

function InputField<T extends inputType>(state: inputStateSetter<T, any>) {
    const inputClassName: string = "w-full p-2 rounded bg-[#2d3e33] text-white border border-[#3a5244] focus:outline-none focus:ring-2 focus:ring-[#95d5b2]";
    const selectClassName = "w-full p-2 rounded bg-[#2d3e33] text-white border border-[#3a5244] " +
        "focus:outline-none focus:ring-2 focus:ring-[#95d5b2]"
    // const multiAdditionClassName = " h-[11em] custom-scroll";
    const multicheckboxClassName = "w-full p-2 rounded bg-[#2d3e33] text-white border border-[#3a5244] space-y-2";

    let content: React.JSX.Element;
    if (state.inputBoxType == 'input') {
        content = <div className={'relative'}><input
            id='s_game_name'
            value={state.curValue as string}
            onChange={e => state.setValue(e.target.value as T)}
            placeholder="Cerca..."
            className={inputClassName}/>
            {state.curValue && (
                <button
                    onClick={() => state.setValue('' as T)}
                    className="absolute text-xl right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                > ×
                </button>
            )}</div>
    } else if (state.inputBoxType == 'select') {
        content = <select value={state.curValue as string}
                          onChange={e => state.setValue(e.target.value as T)}
                          className={selectClassName}>
            {state.options?.map((option: string, index: number) => (
                <option key={index} value={option}>{option}</option>))}
        </select>
    } else if (state.inputBoxType == 'multiselect') {
        function handleCheckboxChange<T extends string>(
            value: T,
            checked: boolean,
            curValue: T[],
            setValue: React.Dispatch<React.SetStateAction<T[]>>
        ) {
            if (checked) {
                setValue([...curValue, value]);
            } else {
                setValue(curValue.filter(v => v !== value));
            }
        }

        content = <div className={multicheckboxClassName}>
            {state.options?.map((option: string) => (<label key={option} className='block'>
                <input type='checkbox'
                       value={option}
                       onChange={e => handleCheckboxChange(
                           option,
                           e.target.checked,
                           state.curValue as string[],
                           state.setValue as Dispatch<SetStateAction<string[]>>)}
                />
                {' ' + option}
            </label>))}
        </div>
    } else if (state.inputBoxType == 'toggle') {
        content = <button
            onClick={() => {
                state.setValue(!state.curValue as T)
            }}
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                state.curValue ? 'bg-[#95d5b2]' : 'greenDDD'}`}>
                <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                        state.curValue ? 'translate-x-6' : 'translate-x-0'
                    }`}
                />
        </button>
    } else {
        throw new Error("Unsupported input box type");
    }


    return <label className="mb-4 mx-2 font-medium text-[#b7e4c7] flex flex-col justify-center">
        <span>{state.labelText}</span>
        {content}
    </label>
}

export function Sidebar({userInputs}: { userInputs: userInputs }) {
    return <>
        <div className="flex sticky top-0 pl-4 p-8 max-h-screen overflow-y-auto overflow-hidden flex-col md:block space-y-0
                md:space-y-6  space-x-4 md:space-x-0 md:mb-0 md:text-left ">
            <h1 className="m-auto p-4 text-2xl font-bold text-[#b7e4c7]"> Parametri</h1>
            {/*{Object.entries(userInputs).map(([key, value]) => (*/}
            {/*    <InputField key={key} {...value}/>*/}
            {/*))}*/}
            <InputField {...userInputs.search} />
            <div className="flex justify-between">
                <InputField {...userInputs.players} />
                <InputField {...userInputs.expansion} />
            </div>
            <InputField {...userInputs.collab} />
            <InputField {...userInputs.complexity} />
            <InputField {...userInputs.time} />
            <InputField {...userInputs.categ} />
            <InputField {...userInputs.authors} />
            <InputField {...userInputs.publisher} />
            <div className={'p-8'}></div>
        </div>
    </>
}
