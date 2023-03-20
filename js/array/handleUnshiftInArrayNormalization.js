export default function handleUnshiftInArrayNormalization(createStoreForItem = ((item) => item), emit, itemStores, item) {
    const getter = () => itemStores.map((store) => store._());
    const store = createStoreForItem(item);
    store.subscribe((value) => {
        // TODO: use emitted value
        emit._(getter());
    });
    itemStores.unshift(store);
}
