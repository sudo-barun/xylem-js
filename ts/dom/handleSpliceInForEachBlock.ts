import ForEachBlock from "./ForEachBlock.js";
import ForEachBlockItem from "./ForEachBlockItem.js";

export default
function handleSpliceInForEachBlock<T>(this: ForEachBlock<T>, index: number)
{
	const forEachBlockItem = this._virtualDom.splice(index, 1)[0];
	(forEachBlockItem as ForEachBlockItem<T>).notifyBeforeDetachFromDom();
	forEachBlockItem.detachFromDom();
}
