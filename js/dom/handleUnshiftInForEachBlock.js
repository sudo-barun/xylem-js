export default function handleUnshiftInForEachBlock(item) {
    const forEachBlockItem = this._buildVDomFragmentForNewlyAddedArrayItem(item, 0);
    forEachBlockItem.setup();
    forEachBlockItem.setupDom();
    forEachBlockItem.getDomNodes()
        .forEach((node) => {
        const firstNode = this.getFirstNode();
        const nodeAfterFirst = firstNode.nextSibling;
        firstNode.parentNode.insertBefore(node, nodeAfterFirst);
    });
    this._virtualDom.unshift(forEachBlockItem);
    forEachBlockItem.notifyAfterAttachToDom();
}
