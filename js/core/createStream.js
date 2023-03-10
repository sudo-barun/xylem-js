export default function createStream(callback) {
    const subscribers = [];
    const emitter = (value) => {
        subscribers.forEach(subscriber => subscriber(value));
    };
    const unsubscribeFromSource = callback(emitter);
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
    const stream = {
        subscribe,
        unsubscribe: unsubscribeFromSource,
    };
    Object.defineProperty(stream, 'subscribe', { value: stream.subscribe });
    Object.defineProperty(stream, 'unsubscribe', { value: stream.unsubscribe });
    return stream;
}
