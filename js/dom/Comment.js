import NativeComponent, { ComponentWithSingleTextContentMixin } from "./NativeComponent.js";
export default class Comment extends NativeComponent {
    constructor(textContent) {
        super();
        this._textContent = textContent;
        this._domNode = undefined;
    }
    setTextContent(textContent) {
        this._textContent = textContent;
    }
    setupDom() {
        if (this._domNode !== undefined) {
            throw new Error('You cannot call setupDom twice subsequently.');
        }
        let textContent;
        if (typeof this._textContent === 'function') {
            textContent = this._textContent();
        }
        else {
            textContent = this._textContent;
        }
        this._domNode = document.createComment(textContent);
    }
    detachFromDom() {
        this._domNode.parentNode.removeChild(this._domNode);
    }
    afterAttachToDom = ComponentWithSingleTextContentMixin.afterAttachToDom;
    setDomNode(domNode) {
        this._domNode = domNode;
    }
    getTextContentAsString() {
        if (typeof this._textContent === 'function') {
            return this._textContent();
        }
        return this._textContent;
    }
}
