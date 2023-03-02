export default function handleSpliceInForEachBlock({ index$ }) {
    if (this._virtualDom.length === 1) {
        const fallback = this._getFallback();
        fallback.setupDom();
        this._placeholder = fallback;
        this.getFirstNode()?.before(fallback.getDomNode());
        this._virtualDom.push(fallback);
    }
    const forEachBlockItem = this._virtualDom.splice(index$(), 1)[0];
    forEachBlockItem.notifyBeforeDetachFromDom();
    forEachBlockItem.detachFromDom();
}
