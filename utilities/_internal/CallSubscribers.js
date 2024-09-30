export default class CallSubscribers {
    constructor(stream) {
        this._stream = stream;
    }
    _(value) {
        for (const subscriber of this._stream._subscribers) {
            if (typeof subscriber === 'function') {
                subscriber.apply(null, arguments);
            }
            else {
                subscriber._.apply(subscriber, arguments);
            }
        }
    }
}
