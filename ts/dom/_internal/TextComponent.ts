import applyNativeComponentMixin from "./applyNativeComponentMixin.js";
import Supplier from "../../types/Supplier.js";
import isSupplier from "../../utilities/isSupplier.js";
import getValue from "../../utilities/getValue.js";
import NativeComponent from "../../types/_internal/NativeComponent.js";
import SubscriberObject from "../../types/SubscriberObject.js";

export default
class TextComponent
{
	declare _textContent: string|Supplier<string>;
	declare _domNode: Text;

	constructor(textContent: string|Supplier<string>)
	{
		this._textContent = textContent;
		this._domNode = undefined!;
	}

	textContent(textContent?: string|Supplier<string>)
	{
		if (arguments.length !== 0) {
			this._textContent = textContent!;
		}
		return this._textContent;
	}

	getTextContent(): string|Supplier<string>
	{
		return this._textContent;
	}

	setupDom()
	{
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

export default
interface TextComponent extends NativeComponent {}

applyNativeComponentMixin(TextComponent);

class TextContentSubscriber implements SubscriberObject<string>
{
	declare _textComponent: TextComponent;

	constructor(textComponent: TextComponent)
	{
		this._textComponent = textComponent;
	}

	_(value: string): void
	{
		this._textComponent._domNode.textContent = value;
	}
}
