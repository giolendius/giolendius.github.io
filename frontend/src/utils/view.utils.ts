export function renderView(view: HTMLElement) {
    const radice = cleanRoot();
    radice.appendChild(view);
}

function cleanRoot(): HTMLElement {
    const root = document.getElementById('radice')!;
    root.childNodes.forEach((node) => {root?.removeChild(node)});
    return root;
}