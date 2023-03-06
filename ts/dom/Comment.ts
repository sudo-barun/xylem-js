import Getter from "../types/Getter.js";
import SubscribableGetter from "../types/SubscribableGetter.js";
import NativeComponent, { ComponentWithSingleTextContentMixin } from "./NativeComponent.js";

export default
class Comment extends NativeComponent
{
	_textContent: string|Getter<string>|SubscribableGetter<string>;
	_domNode!: globalThis.Comment;

	constructor(textContent: string|Getter<string>|SubscribableGetter<string>)
	{
		super();
		this._textContent = textContent;
	}

	setTextContent(textContent: string|Getter<string>|SubscribableGetter<string>)
	{
		this._textContent = textContent;
	}

	setupDom()
	{
		if (this._domNode !== undefined) {
			throw new Error('You cannot call setupDom twice subsequently.');
		}
		let textContent: string;
		if (typeof this._textContent === 'function') {
			textContent = this._textContent();
		} else {
			textContent = this._textContent;
		}
		this._domNode = document.createComment(textContent);
	}

	detachFromDom()
	{
		this._domNode.parentNode!.removeChild(this._domNode);
	}

	afterAttachToDom = ComponentWithSingleTextContentMixin.afterAttachToDom;
}
