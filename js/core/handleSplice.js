export default function handleSplice(createStoreForItem = ((item) => item), emit, itemStores, { index$ }) {
    itemStores.splice(index$(), 1);
}
