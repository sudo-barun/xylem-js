import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";
export default function map(hasLifecycle, supplier, mapper) {
    return new MappedSupplier(hasLifecycle, supplier, mapper);
}
class MappedSupplier {
    constructor(hasLifecycle, supplier, mapper) {
        this._hasLifecycle = hasLifecycle;
        this._supplier = supplier;
        this._mapper = mapper;
        this._subscribers = [];
        hasLifecycle.beforeDetachFromDom.subscribe(supplier.subscribe(new StoreSubscriber(this, mapper)));
    }
    _() {
        if (typeof this._mapper === 'function') {
            return this._mapper(this._supplier._());
        }
        else {
            return this._mapper._(this._supplier._());
        }
    }
    _emit(value) {
        const callSubscribers = new CallSubscribers(this);
        callSubscribers._.apply(callSubscribers, arguments);
    }
    subscribe(subscriber) {
        this._subscribers.push(subscriber);
        return new UnsubscriberImpl(this, subscriber);
    }
    get _value() {
        return this._();
    }
}
class StoreSubscriber {
    constructor(mappedStore, mapper) {
        this._mappedStore = mappedStore;
        this._mapper = mapper;
    }
    _(value) {
        if (typeof this._mapper === 'function') {
            this._mappedStore._emit(this._mapper(value));
        }
        else {
            this._mappedStore._emit(this._mapper._(value));
        }
    }
}
