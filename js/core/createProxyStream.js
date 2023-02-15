import createStream from "./createStream.js";
export default function createProxyStream(callback) {
    const subscribers = [];
    const sourceStream = createStream();
    const unsubscribeFromSource = callback(sourceStream);
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
    sourceStream.subscribe((value) => {
        subscribers.forEach(subscriber => subscriber(value));
    });
    const proxyStream = {
        subscribe,
        unsubscribe: unsubscribeFromSource,
    };
    Object.defineProperty(proxyStream, 'subscribe', { value: proxyStream.subscribe });
    Object.defineProperty(proxyStream, 'unsubscribe', { value: proxyStream.unsubscribe });
    return proxyStream;
}
