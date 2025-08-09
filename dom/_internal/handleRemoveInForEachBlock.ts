import type ForEachBlock from "./ForEachBlock.js";
import type ForEachBlockItem from "./ForEachBlockItem.js";

export default
function handleRemoveInForEachBlock<T>(this: ForEachBlock<T>, index: number)
{
	const forEachBlockItem = this._children.splice(index, 1)[0];
	(forEachBlockItem as ForEachBlockItem<T>).notifyBeforeDetachFromDom();
	forEachBlockItem.detachFromDom();
}
