import applyNativeComponentMixin from "./applyNativeComponentMixin.js";
import DataNode from "../../types/DataNode.js";
import getValue from "../../utilities/getValue.js";
import NativeComponent from "../../types/_internal/NativeComponent.js";

export default
class TextComponent
{
	declare _textContent: string|DataNode<string>;
	declare _domNode: Text;

	constructor(textContent: string|DataNode<string>)
	{
		this._textContent = textContent;
		this._domNode = undefined!;
	}

	textContent(textContent?: string|DataNode<string>)
	{
		if (arguments.length !== 0) {
			this._textContent = textContent!;
		}
		return this._textContent;
	}

	getTextContent(): string|DataNode<string>
	{
		return this._textContent;
	}

	setupSubscribers()
	{
		if ((typeof this._textContent === 'function') && ('subscribe' in this._textContent)) {
			this._textContent.subscribe((text) => this._domNode.textContent = text);
		}
	}

	setupDom()
	{
		const nodeExists = !!this._domNode;

		if (nodeExists) {
			const textContent = getValue(this.textContent());
			if (textContent !== this._domNode.textContent) {
				console.error('Content of Text object is different from content of Text node.');
				console.error('Content of Text node:', this._domNode.textContent);
				console.error('Content of Text object:', textContent);
				throw new Error('Content of Text object is different from content of Text node.');
			}
		}

		this.setupSubscribers();
		this._domNode = this._domNode || document.createTextNode(getValue(this.textContent()));
	}
}

export default
interface TextComponent extends NativeComponent {}

applyNativeComponentMixin(TextComponent);
