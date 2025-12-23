
export function getElementById(elementId: string): HTMLElement {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Elemento con id '${elementId}' non trovato`);
    }
    return element;
}