export default function createProxyStore(getter, stream) {
    const subscribers = [];
    const proxyStore = () => getter();
    const unsubscribeFromSource = stream.subscribe((value) => {
        subscribers.forEach(subscriber => subscriber(value));
    });
    const removeSubscriber = function (subscriber) {
        const index = subscribers.indexOf(subscriber);
        if (index !== -1) {
            subscribers.splice(index, 1);
        }
    };
    const subscribe = function (subscriber) {
        subscribers.push(subscriber);
        return function () {
            removeSubscriber(subscriber);
        };
    };
    proxyStore.subscribe = subscribe;
    Object.defineProperty(proxyStore, 'subscribe', { value: subscribe });
    Object.defineProperty(proxyStore, 'source', { value: { getter, stream } });
    proxyStore.unsubscribeFromSource = unsubscribeFromSource;
    Object.defineProperty(proxyStore, 'unsubscribeFromSource', { value: unsubscribeFromSource });
    return proxyStore;
}
