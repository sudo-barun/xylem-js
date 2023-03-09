import NativeComponent, { ComponentWithSingleTextContentMixin } from "./NativeComponent.js";
export default class Text extends NativeComponent {
    constructor(textContent) {
        super();
        this._textContent = textContent;
        this._domNode = undefined;
    }
    setTextContent(textContent) {
        this._textContent = textContent;
    }
    createDomNode(textContent) {
        return document.createTextNode(textContent);
    }
    getTextContentAsString() {
        if (typeof this._textContent === 'function') {
            return this._textContent();
        }
        return this._textContent;
    }
    setupSubscribers() {
        if (typeof this._textContent === 'function') {
            if ('subscribe' in this._textContent) {
                this._textContent.subscribe((text) => this._domNode.textContent = text);
            }
        }
    }
    setupDom() {
        const nodeExists = !!this._domNode;
        if (nodeExists) {
            const textContent = this.getTextContentAsString();
            if (textContent !== this._domNode.textContent) {
                console.error('Content of Text object is different from content of Text node.');
                console.error('Content of Text node:', this._domNode.textContent);
                console.error('Content of Text object:', textContent);
                throw new Error('Content of Text object is different from content of Text node.');
            }
        }
        this.setupSubscribers();
        this._domNode = this._domNode || this.createDomNode(this.getTextContentAsString());
    }
    setDomNode(domNode) {
        this._domNode = domNode;
    }
    afterAttachToDom = ComponentWithSingleTextContentMixin.afterAttachToDom;
    detachFromDom() {
        this._domNode.parentNode.removeChild(this._domNode);
    }
}
