import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";
export default function map(dataNode, callback) {
    return new MappedDataNode(dataNode, callback);
}
class MappedDataNode {
    constructor(store, mapper) {
        this._store = store;
        this._mapper = mapper;
        this._subscribers = [];
        store.subscribe(new StoreSubscriber(this, mapper));
    }
    _() {
        return this._mapper(this._store._());
    }
    _emit(value) {
        const callSubscribers = new CallSubscribers(this);
        callSubscribers._.apply(callSubscribers, arguments);
    }
    subscribe(subscriber) {
        this._subscribers.push(subscriber);
        return new UnsubscriberImpl(this, subscriber);
    }
}
class StoreSubscriber {
    constructor(mappedStore, mapper) {
        this._mappedStore = mappedStore;
        this._mapper = mapper;
    }
    _(value) {
        this._mappedStore._emit(this._mapper(value));
    }
}
