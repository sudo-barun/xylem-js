export default function handleMoveInForEachBlock(fromIndex, toIndex) {
    const destination = this._virtualDom[toIndex];
    const removedItem = this._virtualDom.splice(fromIndex, 1)[0];
    removedItem.detachFromDom();
    this._virtualDom.splice(toIndex, 0, removedItem);
    if (fromIndex < toIndex) {
        const destinationNode = destination.getLastNode();
        const nextSibling = destinationNode.nextSibling;
        removedItem.getDomNodes().forEach((removedNode) => {
            destinationNode.parentNode.insertBefore(removedNode, nextSibling);
        });
    }
    else if (fromIndex > toIndex) {
        const destinationNode = destination.getFirstNode();
        removedItem.getDomNodes().forEach((removedNode) => {
            destinationNode.parentNode.insertBefore(removedNode, destinationNode);
        });
    }
}
