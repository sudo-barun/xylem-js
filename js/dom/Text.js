import NativeComponent, { ComponentWithSingleTextContentMixin } from "./NativeComponent.js";
export default class Text extends NativeComponent {
    _textContent;
    _cleanup;
    _domNode;
    constructor(textContent) {
        super();
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
        this.setupSubscribers();
        this._domNode = this._domNode ?? this.createDomNode(this.getTextContentAsString());
    }
    setDomNode(domNode) {
        this._domNode = domNode;
    }
    afterAttachToDom = ComponentWithSingleTextContentMixin.afterAttachToDom;
    detachFromDom() {
        this._domNode.parentNode.removeChild(this._domNode);
    }
}
