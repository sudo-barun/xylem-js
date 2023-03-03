export default function handleSpliceInForEachBlock(index) {
    const forEachBlockItem = this._virtualDom.splice(index, 1)[0];
    forEachBlockItem.notifyBeforeDetachFromDom();
    forEachBlockItem.detachFromDom();
}
