import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import _Unsubscriber from "../utilities/_internal/UnsubscriberImpl.js";
export default function createDataNode(getter, stream) {
    return new DataNodeImpl(getter, stream);
}
class DataNodeImpl {
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
    constructor(dataNode) {
        this._dataNode = dataNode;
    }
    _(value) {
        this._dataNode._emit(value);
    }
}
