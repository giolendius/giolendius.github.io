import React, {Dispatch, SetStateAction, useState} from "react";


const tipologie = [
    "Piazzamento Lavoratori",
    "Gestionale",
    "Social Deduction",
    "Parole",
    "EngineBuilding",
    "Asimmetrici"]

interface StateWithSetter<T extends string | string [], K extends string> {
    curValue: T;
    setValue: Dispatch<SetStateAction<T>>;
    inputType: 'input' | 'select' | 'multiselect';
    options?: K[];
    labelText: string;
}

export interface userInputs {
    search: StateWithSetter<string, string>;
    players: StateWithSetter<string, string>;
    collab: StateWithSetter<string[], string>;
    complexity: StateWithSetter<string[], string>;
    time: StateWithSetter<string[], string>;
    categ: StateWithSetter<string[], string>;
    authors: StateWithSetter<string, string>;
    publisher: StateWithSetter<string, string>;
}

function createInputField(inputType: 'input' | 'select', labelText: string, options?: string[]): StateWithSetter<string, string> {
    if (inputType != 'input' && !options) {
        throw new Error("Options must be provided for select input type");
    }
    const [curValue, setValue] = useState<string>('');
    return {curValue, setValue, inputType, labelText, options};
}

function createMultiselectInputField(labelText: string, options: string[]): StateWithSetter<string[], string> {
    const [curValue, setValue] = useState<string[]>([]);
    return {curValue, setValue, inputType: 'multiselect', labelText, options};
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
        publisher: createInputField('input', 'Cerca editore:') // Example publishers
    }
}

function InputField<T extends string | string[]>(state: StateWithSetter<T, string>) {
    const inputClassName: string = "w-full p-2 rounded bg-[#2d3e33] text-white border border-[#3a5244] focus:outline-none focus:ring-2 focus:ring-[#95d5b2]";
    const selectClassName = "w-full p-2 rounded bg-[#2d3e33] text-white border border-[#3a5244] focus:outline-none focus:ring-2 focus:ring-[#95d5b2]"
    // const multiAdditionClassName = " h-[11em] custom-scroll";
    const multicheckboxClassName = "w-full p-2 rounded bg-[#2d3e33] text-white border border-[#3a5244] space-y-2";

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

    return <div className="mb-4">
        <label htmlFor="s_game_name" className="block mb-1 text-sm font-medium text-[#b7e4c7]">
            {state.labelText}
            {state.inputType == 'input' && <div className={'relative'}><input
                id='s_game_name'
                value={state.curValue}
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
            }
            {state.inputType == 'select' && <select value={state.curValue}
                                                    onChange={e => state.setValue(e.target.value as T)}
                                                    className={selectClassName}>
                {state.options?.map((option: string, index: number) => (
                    <option key={index} value={option}>{option}</option>))}
            </select>}
            {state.inputType == 'multiselect' && <div className={multicheckboxClassName}>
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
            </div>}
        </label>
    </div>
}

export function Sidebar({userInputs}: { userInputs: userInputs }) {
    return <>
        <div className="flex sticky top-0 pl-4 p-8 max-h-screen overflow-y-auto overflow-hidden flex-col md:block space-y-0
                md:space-y-6  space-x-4 md:space-x-0 md:mb-0 md:text-left ">
            <h1 className="m-auto p-4 text-2xl font-bold text-[#b7e4c7]"> Parametri</h1>
            {Object.entries(userInputs).map(([key, value]) => (
                <InputField key={key} {...value}/>))}
        </div>
    </>
}

