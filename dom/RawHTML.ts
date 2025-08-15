import type ComponentChildren from '../types/ComponentChildren.js';
import Component from './Component.js';

type Attrs = {
	children: string,
};

export default
class RawHTML extends Component<Attrs>
{
	declare _childNodes: Array<ChildNode>;

	setupDom(): void
	{
		super.setupDom();
		const doc = new DOMParser().parseFromString(this._attributes.children, 'text/html');
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
		const nodes = this._childNodes.slice();
		nodes.unshift(this._firstNode);
		nodes.push(this._lastNode);
		return nodes;
	}

	getContent(): string
	{
		return this._attributes.children;
	}
}
