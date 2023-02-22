import Store from "../types/Store.js";
import Component from "./Component.js";
import ForEachBlock from "./ForEachBlock.js";

export default
function handleSpliceInForEachBlock<T>(this: ForEachBlock<T>, {index$}: {index$: Store<number>})
{
	if (this._forItems.length === 1) {
		const fallback = this._getFallback();
		fallback.setupDom();
		this._placeholder = fallback;
		this.getFirstNode()?.before(fallback.getDomNode());
		this._virtualDom.push(fallback);
	}

	const removedFragment = this._forItems.splice(index$(), 1);
	removedFragment[0].forEach((componentItem) => {
		const index = this._virtualDom.indexOf(componentItem);
		this._virtualDom.splice(index, 1);
	})
	removedFragment[0].forEach((componentItem) => {
		if (componentItem instanceof Component) {
			componentItem.getDomNodes().forEach((node) => node.remove());
		} else {
			componentItem.getDomNode().remove();
		}
	});
}
