import ComponentItem from "../types/ComponentItem.js";
import Component from "./Component.js";
import Element from "./Element.js";
import ForEachBlock from "./ForEachBlock.js";

export default
function handleUnshiftInForEachBlock<T>(this: ForEachBlock<T>, {item}: {item: T})
{
	const vDomFragment = this._buildVDomFragmentForNewlyAddedArrayItem(
		item,
		0
	);
	setupVDomFragment(vDomFragment);

	getFlattenedDomNodesOfVDomFragment(vDomFragment)
	.forEach((node) => {
		if (this._placeholder) {
			this._placeholder.getDomNode().parentNode!.insertBefore(
				node,
				this._placeholder.getDomNode()
			);
			this._placeholder.getDomNode().remove();
			this._virtualDom.splice(
				this._virtualDom.indexOf(this._placeholder), 1
			);
			this._placeholder = null;
		} else {
			const firstNode = this.getFirstNode();
			firstNode!.parentNode!.insertBefore(node, firstNode);
		}
	});
	this._forItems.unshift(vDomFragment);
	this._virtualDom.unshift(...vDomFragment);
}

function setupVDomFragment(vDomFragment: ComponentItem[])
{
	vDomFragment.forEach(_vDom => {
		if (
			(_vDom instanceof Component)
			||
			(_vDom instanceof Element)
		) {
			_vDom.setup();
		}
	});
	vDomFragment.forEach(_vDom => {
		_vDom.setupDom();
	});
}

function getFlattenedDomNodesOfVDomFragment(vDomFragment: ComponentItem[]): ChildNode[]
{
	return vDomFragment.map(componentItem => {
		if (componentItem instanceof Component) {
			return componentItem.getDomNodes();
		} else {
			return componentItem.getDomNode();
		}
	}).flat();
}
