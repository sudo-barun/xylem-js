export default function handleMoveInForEachBlock(fromIndex, toIndex) {
    const destination = this.children()[toIndex];
    const removedItem = this.children().splice(fromIndex, 1)[0];
    removedItem.detachFromDom();
    this.children().splice(toIndex, 0, removedItem);
    if (fromIndex < toIndex) {
        const destinationNode = destination.lastNode();
        const nextSibling = destinationNode.nextSibling;
        for (const removedNode of removedItem.domNodes()) {
            destinationNode.parentNode.insertBefore(removedNode, nextSibling);
        }
    }
    else if (fromIndex > toIndex) {
        const destinationNode = destination.firstNode();
        for (const removedNode of removedItem.domNodes()) {
            destinationNode.parentNode.insertBefore(removedNode, destinationNode);
        }
    }
}
