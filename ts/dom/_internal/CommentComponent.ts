import applyNativeComponentMixin from "./applyNativeComponentMixin.js";
import DataNode from "../../types/DataNode.js";
import NativeComponent from "../../types/_internal/NativeComponent.js";

export default
class CommentComponent
{
	declare _textContent: string|DataNode<string>;
	declare _domNode: Comment;

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
}

export default
interface CommentComponent extends NativeComponent {}

applyNativeComponentMixin(CommentComponent);
