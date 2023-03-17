import applyNativeComponentMixin from "./applyNativeComponentMixin.js";
import DataNode from "../../types/DataNode.js";
import getValue from "../../utilities/getValue.js";
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

		if (isDataNode(this._textContent)) {
			this._textContent.subscribe(new TextContentSubscriber(this));
		}

		this._domNode = this._domNode || document.createComment(textContent);
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
