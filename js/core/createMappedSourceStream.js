export default function createMappedSourceStream(callback) {
    const subscribers = [];
    const emit = function (value) {
        subscribers.forEach(subscriber => {
            if (arguments.length) {
                subscriber(value);
            }
            else {
                subscriber();
            }
        });
    };
    const stream = function (value) {
        if (callback) {
            callback(emit, value);
        }
        else {
            emit(value);
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
    return stream;
}
