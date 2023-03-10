export default function handleUnshift(createStoreForItem = ((item) => item), emit, itemStores, item) {
    const getter = () => itemStores.map((store) => store());
    const store = createStoreForItem(item);
    store.subscribe((value) => {
        // TODO: use emitted value
        emit(getter());
    });
    itemStores.unshift(store);
}
