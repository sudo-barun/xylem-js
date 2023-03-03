export default function handlePushInForEachBlock(item) {
    const forEachBlockItem = this._buildVDomFragmentForNewlyAddedArrayItem(item, this.getLength() - 1);
    forEachBlockItem.setup();
    forEachBlockItem.setupDom();
    forEachBlockItem.getDomNodes()
        .forEach((node) => {
        const lastNode = this.getLastNode();
        lastNode.parentNode.insertBefore(node, lastNode);
    });
    this._virtualDom.push(forEachBlockItem);
    forEachBlockItem.notifyAfterAttachToDom();
}
