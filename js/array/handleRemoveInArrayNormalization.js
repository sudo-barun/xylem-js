export default function handleRemoveInArrayNormalization(createStoreForItem = ((item) => item), emit, itemStores, index) {
    itemStores.splice(index, 1);
}
