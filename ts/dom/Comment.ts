import applyNativeComponentMixin from "./_internal/applyNativeComponentMixin.js";
import Getter from "../types/Getter.js";
import NativeComponent from "../types/_internal/NativeComponent.js";
import SubscribableGetter from "../types/SubscribableGetter.js";

export default
class Comment
{
	declare _textContent: string|Getter<string>|SubscribableGetter<string>;
	declare _domNode: globalThis.Comment;

	constructor(textContent: string|Getter<string>|SubscribableGetter<string>)
	{
		this._textContent = textContent;
		this._domNode = undefined!;
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

	getTextContentAsString(): string
	{
		if (typeof this._textContent === 'function') {
			return this._textContent();
		}
		return this._textContent;
	}
}

export default
interface Comment extends NativeComponent {}

applyNativeComponentMixin(Comment);
