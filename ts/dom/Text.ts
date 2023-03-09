import applyNativeComponentMixin from "./_internal/applyNativeComponentMixin.js";
import Getter from "../types/Getter.js";
import NativeComponent from "../types/_internal/NativeComponent.js";
import Store from "../types/Store.js";
import SubscribableGetter from "../types/SubscribableGetter.js";

export default
class Text
{
	declare _textContent: string|Getter<string>|SubscribableGetter<string>;
	declare _domNode: globalThis.Text;

	constructor(textContent: string|Getter<string>|Store<string>)
	{
		this._textContent = textContent;
		this._domNode = undefined!;
	}

	setTextContent(textContent: string|Getter<string>|SubscribableGetter<string>)
	{
		this._textContent = textContent;
	}

	createDomNode(textContent: string): globalThis.Text
	{
		return document.createTextNode(textContent);
	}

	getTextContentAsString(): string
	{
		if (typeof this._textContent === 'function') {
			return this._textContent();
		}
		return this._textContent;
	}

	setupSubscribers()
	{
		if (typeof this._textContent === 'function') {
			if ('subscribe' in this._textContent) {
				this._textContent.subscribe((text) => this._domNode.textContent = text);
			}
		}
	}

	setupDom()
	{
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
}

export default
interface Text extends NativeComponent {}

applyNativeComponentMixin(Text);
