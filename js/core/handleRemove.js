export default function handleRemove(createStoreForItem = ((item) => item), emit, itemStores, index) {
    itemStores.splice(index, 1);
}
