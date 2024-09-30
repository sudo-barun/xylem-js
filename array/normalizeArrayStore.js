import createSupplier from "../core/createSupplier.js";
import createEmittableStream from "../core/createEmittableStream.js";
class NormalizedData {
    _() {
        return this._itemStores.map((store) => store._());
    }
}
class ItemStoreSubscriber {
    constructor(normalizedData, stream) {
        this._normalizedData = normalizedData;
        this._stream = stream;
    }
    _(value) {
        // TODO: use emitted value
        this._stream._(this._normalizedData._());
    }
}
export default function normalizeArrayStore(arrayStore, createStoreForItem) {
    const normalizedData = new NormalizedData();
    const stream = createEmittableStream();
    const initItemStores = (value) => {
        normalizedData._itemStores = value.map(createStoreForItem);
        for (const store of normalizedData._itemStores) {
            store.subscribe(new ItemStoreSubscriber(normalizedData, stream));
        }
    };
    initItemStores(arrayStore._());
    arrayStore.subscribe((value) => {
        initItemStores(value);
        stream._(normalizedData._());
    });
    arrayStore.mutation.subscribe(([value, action, ...mutationArgs]) => {
        const handler = action.normalizeArrayStore;
        if (!('normalizeArrayStore' in action)) {
            console.error('Array was mutated with action but no handler found for the action.', action);
            throw new Error('Array was mutated with action but no handler found for the action.');
        }
        if (!isHandler(handler)) {
            throw new Error('Provided handler is invalid.');
        }
        handler(createStoreForItem, stream, normalizedData._itemStores, ...mutationArgs);
        stream._(normalizedData._());
    });
    return createSupplier(normalizedData, stream);
}
function isHandler(value) {
    return typeof value === 'function';
}
