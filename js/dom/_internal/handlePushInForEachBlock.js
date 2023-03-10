export default function handlePushInForEachBlock(item) {
    const forEachBlockItem = this._buildVDomFragmentForNewlyAddedArrayItem(item, this.getLength() - 1);
    forEachBlockItem.setup();
    forEachBlockItem.setupDom();
    forEachBlockItem.domNodes()
        .forEach((node) => {
        const lastNode = this.lastNode();
        lastNode.parentNode.insertBefore(node, lastNode);
    });
    this._children.push(forEachBlockItem);
    forEachBlockItem.notifyAfterAttachToDom();
}
