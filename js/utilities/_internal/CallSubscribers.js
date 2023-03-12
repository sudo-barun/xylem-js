export default class CallSubscribers {
    constructor(stream) {
        this._stream = stream;
    }
    _(value) {
        this._stream._subscribers.forEach(subscriber => {
            if (typeof subscriber === 'function') {
                subscriber.apply(null, arguments);
            }
            else {
                subscriber._.apply(subscriber, arguments);
            }
        });
    }
}
