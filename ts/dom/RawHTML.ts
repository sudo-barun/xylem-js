import ComponentChildren from '../types/ComponentChildren.js';
import Component from './Component.js';

export default
class RawHTML extends Component
{
	declare _content: string;
	declare _childNodes: Array<ChildNode>;

	constructor(content: string)
	{
		super();
		this._content = content;
	}

	setupDom(): void
	{
		super.setupDom();
		const doc = new DOMParser().parseFromString(this._content, 'text/html');
		this._childNodes = Array.from(doc.body.childNodes);
	}

	build(): ComponentChildren
	{
		return [];
	}

	setChildNodes(childNodes: Array<ChildNode>): void
	{
		this._childNodes = childNodes;
	}

	domNodes(): ChildNode[]
	{
		return this._childNodes;
	}

	getContent(): string
	{
		return this._content;
	}
}
