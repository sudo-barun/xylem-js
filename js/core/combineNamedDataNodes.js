export default function combineNamedDataNodes(stores) {
    const subscribers = [];
    const store = function () {
        return Object.keys(stores).reduce(function (acc, key) {
            acc[key] = stores[key]();
            return acc;
        }, {});
    };
    const removeSubscriber = function (subscriber) {
        const index = subscribers.indexOf(subscriber);
        if (index !== -1) {
            subscribers.splice(index, 1);
        }
    };
    const subscribe = function (fn) {
        subscribers.push(fn);
        return function () {
            removeSubscriber(fn);
        };
    };
    store.subscribe = subscribe;
    Object.defineProperty(store, 'subscribe', { value: subscribe });
    Object.keys(stores).forEach((index) => {
        stores[index].subscribe((value) => {
            const valueToEmit = Object.keys(stores).reduce(function (acc, index2) {
                acc[index2] = index === index2 ? value : stores[index2]();
                return acc;
            }, {});
            subscribers.forEach((subscriber) => {
                subscriber(valueToEmit);
            });
        });
    });
    store._members = stores;
    Object.defineProperty(store, '_members', { value: store._members });
    return store;
}
