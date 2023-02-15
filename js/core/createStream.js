export default function createStream() {
    const subscribers = [];
    const stream = function (value) {
        subscribers.forEach(subscriber => {
            if (arguments.length) {
                subscriber(value);
            }
            else {
                subscriber();
            }
        });
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
