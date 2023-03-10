export default function handleUnshiftInForEachBlock(item) {
    const forEachBlockItem = this._buildVDomFragmentForNewlyAddedArrayItem(item, 0);
    forEachBlockItem.setup();
    forEachBlockItem.setupDom();
    forEachBlockItem.domNodes()
        .forEach((node) => {
        const firstNode = this.firstNode();
        const nodeAfterFirst = firstNode.nextSibling;
        firstNode.parentNode.insertBefore(node, nodeAfterFirst);
    });
    this._children.unshift(forEachBlockItem);
    forEachBlockItem.notifyAfterAttachToDom();
}
