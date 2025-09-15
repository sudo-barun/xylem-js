export default function handleRemoveInArrayNormalization(_createStoreForItem = ((item) => item), _emit, itemStores, index) {
    itemStores.splice(index, 1);
}
