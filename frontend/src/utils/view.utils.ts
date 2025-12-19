export function renderView(view: HTMLElement) {
    const radice = cleanRoot();
    radice.appendChild(view);
}

function cleanRoot(): HTMLElement {
    const root = document.getElementById('radice')!;
    root.childNodes.forEach((node) => {root?.removeChild(node)});
    return root;
}

export function getElementById(elementId: string): HTMLElement {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Elemento con id '${elementId}' non trovato`);
    }
    return element;
}