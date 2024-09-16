export default function handlePushInForEachBlock(item) {
    const forEachBlockItem = this._buildVDomFragmentForNewlyAddedArrayItem(item, this.getLength() - 1);
    forEachBlockItem.setup();
    forEachBlockItem.setupDom();
    for (const node of forEachBlockItem.domNodes()) {
        const lastNode = this.lastNode();
        lastNode.parentNode.insertBefore(node, lastNode);
    }
    this._children.push(forEachBlockItem);
    forEachBlockItem.notifyAfterAttachToDom();
}
