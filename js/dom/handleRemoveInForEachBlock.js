export default function handleRemoveInForEachBlock(index) {
    const forEachBlockItem = this._virtualDom.splice(index, 1)[0];
    forEachBlockItem.notifyBeforeDetachFromDom();
    forEachBlockItem.detachFromDom();
}
