import arrayStoreMutation from "./arrayStoreMutation.js";
import createDataNode from "../core/createDataNode.js";
import createEmittableStream from "../core/createEmittableStream.js";
class NormalizedData {
    _() {
        return this._itemStores.map((store) => store._());
    }
}
export default function normalizeArrayStore(arrayStore, createStoreForItem) {
    const normalizedData = new NormalizedData();
    const stream = createEmittableStream();
    const initItemStores = (value) => {
        normalizedData._itemStores = value.map(createStoreForItem);
        normalizedData._itemStores.forEach((store) => {
            store.subscribe((value) => {
                // TODO: use emitted value
                stream._(normalizedData._());
            });
        });
    };
    initItemStores(arrayStore._());
    arrayStore.subscribe((value) => {
        initItemStores(value);
        stream._(normalizedData._());
    });
    arrayStore.mutation.subscribe(([value, action, ...mutationArgs]) => {
        const handler = arrayStoreMutation.getHandler(action);
        if (handler === null) {
            console.error('Array was mutated with action but no handler found for the action.', action);
            throw new Error('Array was mutated with action but no handler found for the action.');
        }
        handler(createStoreForItem, stream, normalizedData._itemStores, ...mutationArgs);
        stream._(normalizedData._());
    });
    return createDataNode(normalizedData, stream);
}
