import arrayStoreMutation from "./arrayStoreMutation.js";
import createDataNode from "../core/createDataNode.js";
import createEmittableStream from "../core/createEmittableStream.js";
export default function normalizeArrayStore(arrayStore, createStoreForItem) {
    const getter = () => itemStores.map((store) => store());
    const stream = createEmittableStream();
    let itemStores;
    const initItemStores = (value) => {
        itemStores = value.map(createStoreForItem);
        itemStores.forEach((store) => {
            store.subscribe((value) => {
                // TODO: use emitted value
                stream(getter());
            });
        });
    };
    initItemStores(arrayStore());
    arrayStore.subscribe((value) => {
        initItemStores(value);
        stream(getter());
    });
    arrayStore.mutate.subscribe(([value, action, ...mutationArgs]) => {
        const handler = arrayStoreMutation.getHandler(action);
        if (handler === null) {
            console.error('Array was mutated with action but no handler found for the action.', action);
            throw new Error('Array was mutated with action but no handler found for the action.');
        }
        handler(createStoreForItem, stream, itemStores, ...mutationArgs);
        stream(getter());
    });
    return createDataNode(getter, stream);
}
