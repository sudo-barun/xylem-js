import applyNativeComponentMixin from "./applyNativeComponentMixin.js";
import isSupplier from "../../utilities/isSupplier.js";
import getValue from "../../utilities/getValue.js";
export default class TextComponent {
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
    getTextContent() {
        return this._textContent;
    }
    setupDom() {
        const nodeExists = !!this._domNode;
        const textContent = getValue(this.textContent());
        if (nodeExists) {
            if (String(textContent) !== this._domNode.textContent) {
                console.error('Content of Text object is different from content of Text node.');
                console.error('Content of Text node:', this._domNode.textContent);
                console.error('Content of Text object:', textContent);
                throw new Error('Content of Text object is different from content of Text node.');
            }
        }
        if (isSupplier(this._textContent)) {
            this._textContent.subscribe(new TextContentSubscriber(this));
        }
        this._domNode = this._domNode || document.createTextNode(textContent);
    }
}
applyNativeComponentMixin(TextComponent);
class TextContentSubscriber {
    constructor(textComponent) {
        this._textComponent = textComponent;
    }
    _(value) {
        this._textComponent._domNode.textContent = value;
    }
}
