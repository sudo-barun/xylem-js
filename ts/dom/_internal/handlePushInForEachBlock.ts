import ForEachBlock from "./ForEachBlock.js";

export default
function handlePushInForEachBlock<T>(this: ForEachBlock<T>, item: T)
{
	const forEachBlockItem = this._buildVDomFragmentForNewlyAddedArrayItem(
		item,
		this.getLength() - 1
	);
	if (this._modifier) {
		forEachBlockItem.setModifier(this._modifier);
	}
	forEachBlockItem.setParentComponent(this.getParentComponent());
	forEachBlockItem.setup();
	forEachBlockItem.notifyAfterSetup();
	forEachBlockItem.setupDom();

	const lastNode = this.lastNode();
	for (const node of forEachBlockItem.domNodes()) {
		lastNode.parentNode!.insertBefore(node, lastNode);
	}
	this._children.push(forEachBlockItem);
	forEachBlockItem.notifyAfterAttachToDom();
}
