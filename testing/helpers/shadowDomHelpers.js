export function getRoot() {
    return document.querySelector('#qunit-fixture').shadowRoot || document;
}

export function getActiveElement() {
    return getRoot().activeElement;
}

