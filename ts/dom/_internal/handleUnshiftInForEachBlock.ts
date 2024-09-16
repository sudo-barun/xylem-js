import ForEachBlock from "./ForEachBlock.js";

export default
function handleUnshiftInForEachBlock<T>(this: ForEachBlock<T>, item: T)
{
	const forEachBlockItem = this._buildVDomFragmentForNewlyAddedArrayItem(
		item,
		0
	);
	forEachBlockItem.setup();
	forEachBlockItem.setupDom();

	for (const node of forEachBlockItem.domNodes()) {
		const firstNode = this.firstNode();
		const nodeAfterFirst = firstNode.nextSibling;
		firstNode.parentNode!.insertBefore(node, nodeAfterFirst);
	}
	this._children.unshift(forEachBlockItem);
	forEachBlockItem.notifyAfterAttachToDom();
}
