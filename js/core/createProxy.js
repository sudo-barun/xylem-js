export default function createProxy(store, handleUnsubscription) {
    const subscribers = [];
    const proxy = function () {
        return store.apply(null, arguments);
    };
    proxy._original = store;
    const unsubscribeFromOriginal = store.subscribe((value) => {
        subscribers.forEach(subscriber => subscriber(value));
    });
    const removeSubscriber = function (subscriber) {
        const index = subscribers.indexOf(subscriber);
        if (index === -1) {
            throw new Error('Subscriber already removed from the list of subscribers');
        }
        subscribers.splice(index, 1);
    };
    const subscribe = function (subscriber) {
        subscribers.push(subscriber);
        return function () {
            removeSubscriber(subscriber);
        };
    };
    proxy.subscribe = subscribe;
    Object.defineProperty(proxy, 'subscribe', { value: subscribe });
    handleUnsubscription(unsubscribeFromOriginal);
    Object.defineProperty(proxy, 'source', { value: store });
    return proxy;
}
