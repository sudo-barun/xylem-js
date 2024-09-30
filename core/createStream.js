import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";
export default function createStream(callback) {
    return new StreamImpl(callback);
}
class StreamImpl {
    constructor(callback) {
        this._callback = callback;
        this._subscribers = [];
        const emitter = new EmitterImpl(this);
        this._unsubscriber = callback(emitter);
    }
    subscribe(subscriber) {
        this._subscribers.push(subscriber);
        return new UnsubscriberImpl(this, subscriber);
    }
    _emit(value) {
        const callSubscribers = new CallSubscribers(this);
        callSubscribers._.apply(callSubscribers, arguments);
    }
    unsubscribe() {
        this._unsubscriber._();
    }
}
class EmitterImpl {
    constructor(stream) {
        this._stream = stream;
    }
    _(value) {
        this._stream._emit(value);
    }
}
