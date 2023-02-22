import ArrayStore from "../types/ArrayStore.js";
import ComponentItem from "../types/ComponentItem.js";
import Component from "./Component.js";
import Element from "./Element.js";
import ForEachBlock from "./ForEachBlock.js";

export default
function handlePushInForEachBlock<T>(this: ForEachBlock<T>, {item}: {item: T})
{
	const vDomFragment = this._buildVDomFragmentForNewlyAddedArrayItem(
		item,
		(this._array as ArrayStore<T>).length$() - 1
	);
	setupVDomFragment(vDomFragment);

	getFlattenedDomNodesOfVDomFragment(vDomFragment)
	.forEach((node) => {
		if (this._placeholder) {
			this._placeholder.getDomNode().parentNode!.append(node);
			this._placeholder.getDomNode().remove();
			this._virtualDom.splice(
				this._virtualDom.indexOf(this._placeholder), 1
			);
			this._placeholder = null;
		} else {
			this.getLastNode()!.parentNode!.append(node);
		}
	});
	this._forItems.push(vDomFragment);
	this._virtualDom.push(...vDomFragment);
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
