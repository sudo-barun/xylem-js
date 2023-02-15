import createProxyStore from "./createProxyStore.js";
import createStream from "./createStream.js";
import push from "./push.js";
import splice from "./splice.js";
import unshift from "./unshift.js";
export default function normalizeArrayStore(arrayStore, createStoreForItem = ((item) => item)) {
    const getter = () => itemStores.map((store) => store());
    const stream = createStream();
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
    arrayStore.mutate.subscribe(({ value, action, item, index$ }) => {
        if (action === push) {
            handlePush(item);
        }
        else if (action === unshift) {
            handleUnshift(item);
        }
        else if (action === splice) {
            handleSplice(index$);
        }
        else {
            console.error('Action not supported', action);
            throw new Error('Action not supported');
        }
        stream(getter());
    });
    function handlePush(item) {
        const store = createStoreForItem(item);
        store.subscribe((value) => {
            // TODO: use emitted value
            stream(getter());
        });
        itemStores.push(store);
    }
    function handleUnshift(item) {
        const store = createStoreForItem(item);
        store.subscribe((value) => {
            // TODO: use emitted value
            stream(getter());
        });
        itemStores.unshift(store);
    }
    function handleSplice(index$) {
        itemStores.splice(index$(), 1);
    }
    return createProxyStore(getter, stream);
}
