import applyNativeComponentMixin from "./applyNativeComponentMixin.js";
import DataNode from "../../types/DataNode.js";
import isDataNode from "../../utilities/isDataNode.js";
import NativeComponent from "../../types/_internal/NativeComponent.js";
import SubscriberObject from "../../types/SubscriberObject.js";

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
		if (isDataNode(this._textContent)) {
			textContent = this._textContent._();
			this._textContent.subscribe(new TextContentSubscriber(this));
		} else {
			textContent = this._textContent;
		}

		this._domNode = document.createComment(textContent);
	}
}

export default
interface CommentComponent extends NativeComponent {}

applyNativeComponentMixin(CommentComponent);

class TextContentSubscriber implements SubscriberObject<string>
{
	declare _textComponent: CommentComponent;

	constructor(textComponent: CommentComponent)
	{
		this._textComponent = textComponent;
	}

	_(value: string): void
	{
		this._textComponent._domNode.textContent = value;
	}
}
