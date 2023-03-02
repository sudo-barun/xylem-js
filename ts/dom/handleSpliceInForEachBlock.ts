import Store from "../types/Store.js";
import ForEachBlock from "./ForEachBlock.js";
import ForEachBlockItem from "./ForEachBlockItem.js";

export default
function handleSpliceInForEachBlock<T>(this: ForEachBlock<T>, {index$}: {index$: Store<number>})
{
	if (this._virtualDom.length === 1) {
		const fallback = this._getFallback();
		fallback.setupDom();
		this._placeholder = fallback;
		this.getFirstNode()?.before(fallback.getDomNode());
		this._virtualDom.push(fallback);
	}

	const forEachBlockItem = this._virtualDom.splice(index$(), 1)[0];
	(forEachBlockItem as ForEachBlockItem<T>).notifyBeforeDetachFromDom();
	forEachBlockItem.detachFromDom();
}
