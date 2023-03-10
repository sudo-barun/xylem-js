import applyNativeComponentMixin from "./applyNativeComponentMixin.js";
export default class CommentComponent {
    constructor(textContent) {
        this._textContent = textContent;
        this._domNode = undefined;
    }
    textContent(textContent) {
        if (arguments.length !== 0) {
            this._textContent = textContent;
        }
        return this._textContent;
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
}
applyNativeComponentMixin(CommentComponent);
