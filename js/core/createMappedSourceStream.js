export default function createMappedSourceStream(callback) {
    const subscribers = [];
    const emit = function (value) {
        for (const subscriber of subscribers) {
            if (arguments.length) {
                if (typeof subscriber === 'function') {
                    subscriber(value);
                }
                else {
                    subscriber._(value);
                }
            }
            else {
                if (typeof subscriber === 'function') {
                    subscriber();
                }
                else {
                    subscriber._();
                }
            }
        }
    };
    const stream = {
        _: function (value) {
            if (callback) {
                callback(emit, value);
            }
            else {
                emit(value);
            }
        },
        subscribe: undefined,
        subscribeOnly: undefined,
    };
    const removeSubscriber = function (subscriber) {
        const index = subscribers.indexOf(subscriber);
        if (index !== -1) {
            subscribers.splice(index, 1);
        }
    };
    const subscribe = function (subscriber) {
        subscribers.push(subscriber);
        return {
            _: function () {
                removeSubscriber(subscriber);
            },
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
