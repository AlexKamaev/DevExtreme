import $ from 'jquery';

export function appendShadowRootIfNeeded(shadowSelector) {
    if(QUnit.urlParams['shadowDom'] && QUnit.urlParams['nojquery']) {
        this.root = document.createElement('div');

        document.querySelector('#qunit-fixture').appendChild(this.root);

        if(!this.root.shadowRoot) {
            this.root.attachShadow({ mode: 'open' });
        }
        //
        // const control = document.querySelector(shadowSelector);
        // const container = document.createElement('div');
        //
        // this.root.shadowRoot.appendChild(container);
        // container.appendChild(control);
        //
        // this.container = container;
        // this.control = control;
        // this.element = $(control);
    } else {
        this.element = $(shadowSelector);
    }
}

export function clearShadowRootIfNeeded() {
    if(this.root) {
        // TODO: get rid of it after fix jquery event bubbling to shadow dom
        $(this.container).empty();

        this.root.parentNode.removeChild(this.root);

        delete this.root;
        delete this.container;
        delete this.control;
        delete this.element;
    }
}

export function getRoot() {
    const el = document.querySelector('#qunit-fixture');

    return el.shadowRoot || el;
}

export function get(selector) {
    return $(getRoot().querySelector(selector));
}
