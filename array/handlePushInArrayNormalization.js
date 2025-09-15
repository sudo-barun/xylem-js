export default function handlePushInArrayNormalization(createStoreForItem = ((item) => item), emit, itemStores, item) {
    const getter = () => itemStores.map((store) => store._());
    const store = createStoreForItem(item);
    store.subscribe((_value) => {
        // TODO: use emitted value
        emit._(getter());
    });
    itemStores.push(store);
}
