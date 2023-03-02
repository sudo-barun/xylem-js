export default function handlePushInForEachBlock({ item }) {
    const forEachBlockItem = this._buildVDomFragmentForNewlyAddedArrayItem(item, this.getLength() - 1);
    forEachBlockItem.setup();
    forEachBlockItem.setupDom();
    forEachBlockItem.getDomNodes()
        .forEach((node) => {
        if (this._placeholder) {
            this._placeholder.getDomNode().parentNode.append(node);
            this._placeholder.getDomNode().remove();
            this._virtualDom.splice(this._virtualDom.indexOf(this._placeholder), 1);
            this._placeholder = null;
        }
        else {
            this.getLastNode().parentNode.append(node);
        }
    });
    this._virtualDom.push(forEachBlockItem);
    forEachBlockItem.notifyAfterAttachToDom();
}
