export default function handleMove(createStoreForItem = ((item) => item), emit, itemStores, fromIndex, toIndex) {
    const fromIndex_ = typeof fromIndex === 'function' ? fromIndex() : fromIndex;
    const toIndex_ = typeof toIndex === 'function' ? toIndex() : toIndex;
    const removedItemStore = itemStores.splice(fromIndex_, 1)[0];
    itemStores.splice(toIndex_, 0, removedItemStore);
}
