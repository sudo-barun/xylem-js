import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import _Unsubscriber from "../utilities/_internal/UnsubscriberImpl.js";
export default function createSupplier(getter, stream) {
    return new SupplierImpl(getter, stream);
}
class SupplierImpl {
    constructor(getter, stream) {
        this._getter = getter;
        this._stream = stream;
        this._subscribers = [];
        stream.subscribe(new StreamSubscriber(this));
    }
    _() {
        return this._getter._();
    }
    _emit(value) {
        const callSubscribers = new CallSubscribers(this);
        callSubscribers._.apply(callSubscribers, arguments);
    }
    subscribe(subscriber) {
        this._subscribers.push(subscriber);
        return new _Unsubscriber(this, subscriber);
    }
}
class StreamSubscriber {
    constructor(supplier) {
        this._supplier = supplier;
    }
    _(value) {
        this._supplier._emit(value);
    }
}
