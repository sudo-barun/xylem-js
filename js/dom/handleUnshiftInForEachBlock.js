export default function handleUnshiftInForEachBlock({ item }) {
    const forEachBlockItem = this._buildVDomFragmentForNewlyAddedArrayItem(item, 0);
    forEachBlockItem.setup();
    forEachBlockItem.setupDom();
    forEachBlockItem.getDomNodes()
        .forEach((node) => {
        if (this._placeholder) {
            this._placeholder.getDomNode().parentNode.insertBefore(node, this._placeholder.getDomNode());
            this._placeholder.getDomNode().remove();
            this._virtualDom.splice(this._virtualDom.indexOf(this._placeholder), 1);
            this._placeholder = null;
        }
        else {
            const firstNode = this.getFirstNode();
            firstNode.parentNode.insertBefore(node, firstNode);
        }
    });
    this._virtualDom.unshift(forEachBlockItem);
    forEachBlockItem.notifyAfterAttachToDom();
}
