import applyNativeComponentMixin from "./applyNativeComponentMixin.js";
import isDataNode from "../../utilities/isDataNode.js";
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
        if (isDataNode(this._textContent)) {
            textContent = this._textContent._();
            this._textContent.subscribe(new TextContentSubscriber(this));
        }
        else {
            textContent = this._textContent;
        }
        this._domNode = document.createComment(textContent);
    }
}
applyNativeComponentMixin(CommentComponent);
class TextContentSubscriber {
    constructor(textComponent) {
        this._textComponent = textComponent;
    }
    _(value) {
        this._textComponent._domNode.textContent = value;
    }
}
