function createEmitToSubscribers(subscribers) {
    return function emitToSubscribers(value) {
        subscribers.forEach(subscriber => {
            subscriber.apply(null, arguments);
        });
    };
}
export default function createStreamFactory(callback) {
    return factory;
    function factory() {
        const subscribers = [];
        const emit = createEmitToSubscribers(subscribers);
        const stream = function (value) {
            if (arguments.length) {
                callback(emit, value);
            }
            else {
                callback(emit);
            }
        };
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
        stream.subscribe = subscribe;
        Object.defineProperty(stream, 'subscribers', { value: subscribers });
        const subscribeOnly = {
            subscribe,
        };
        stream.subscribeOnly = subscribeOnly;
        Object.defineProperty(stream, 'subscribeOnly', { value: subscribeOnly });
        return stream;
    }
    ;
}
