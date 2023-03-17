import applyNativeComponentMixin from "./applyNativeComponentMixin.js";
import getValue from "../../utilities/getValue.js";
import isSupplier from "../../utilities/isSupplier.js";
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
        const nodeExists = !!this._domNode;
        const textContent = getValue(this.textContent());
        if (nodeExists) {
            if (textContent !== this._domNode.textContent) {
                console.error('Content of Comment object is different from content of Comment node.');
                console.error('Content of Comment node:', this._domNode.textContent);
                console.error('Content of Comment object:', textContent);
                throw new Error('Content of Comment object is different from content of Comment node.');
            }
        }
        if (isSupplier(this._textContent)) {
            this._textContent.subscribe(new TextContentSubscriber(this));
        }
        this._domNode = this._domNode || document.createComment(textContent);
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
