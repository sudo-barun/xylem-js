import Getter from "../types/Getter.js";
import Store from "../types/Store.js";
import SubscribableGetter from "../types/SubscribableGetter.js";
import NativeComponent, { ComponentWithSingleTextContentMixin } from "./NativeComponent.js";

export default class Text extends NativeComponent
{
	_textContent: string|Getter<string>|SubscribableGetter<string>;
	_domNode!: globalThis.Text;

	constructor(textContent: string|Getter<string>|Store<string>)
	{
		super();
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
		this.setupSubscribers();

		this._domNode = this._domNode ?? this.createDomNode(this.getTextContentAsString());
	}

	setDomNode(domNode: globalThis.Text): void
	{
		this._domNode = domNode;
	}

	afterAttachToDom = ComponentWithSingleTextContentMixin.afterAttachToDom;

	detachFromDom()
	{
		this._domNode.parentNode!.removeChild(this._domNode);
	}
}
