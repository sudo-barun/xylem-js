export default function deriveStoreFromArray(stores) {
    const subscribers = [];
    const store = function () {
        return stores.map(store => store());
    };
    const removeSubscriber = function (subscriber) {
        const index = subscribers.indexOf(subscriber);
        if (index !== -1) {
            subscribers.splice(index, 1);
        }
    };
    const subscribe = function (fn) {
        subscribers.push(fn);
        return () => removeSubscriber(fn);
    };
    store.subscribe = subscribe;
    Object.defineProperty(store, 'subscribe', { value: subscribe });
    stores.forEach((store, index) => {
        store.subscribe((value) => {
            const valueToEmit = stores.map((store, index2) => index === index2 ? value : store());
            subscribers.forEach((subscriber) => {
                subscriber(valueToEmit);
            });
        });
    });
    store.members = stores;
    Object.defineProperty(store, 'members', { value: store.members });
    return store;
}
