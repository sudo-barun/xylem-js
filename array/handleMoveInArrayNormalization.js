import getValue from "../utilities/getValue.js";
export default function handleMoveInArrayNormalization(createStoreForItem = ((item) => item), emit, itemStores, fromIndex, toIndex) {
    const fromIndex_ = getValue(fromIndex);
    const toIndex_ = getValue(toIndex);
    const removedItemStore = itemStores.splice(fromIndex_, 1)[0];
    itemStores.splice(toIndex_, 0, removedItemStore);
}
