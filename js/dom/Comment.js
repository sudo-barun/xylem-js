import applyNativeComponentMixin from "./_internal/applyNativeComponentMixin.js";
export default class Comment {
    constructor(textContent) {
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
    getTextContentAsString() {
        if (typeof this._textContent === 'function') {
            return this._textContent();
        }
        return this._textContent;
    }
}
applyNativeComponentMixin(Comment);
