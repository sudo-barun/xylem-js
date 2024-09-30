import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import _Unsubscriber from "../utilities/_internal/UnsubscriberImpl.js";
export default function createStore(value) {
    return new StoreImpl(value);
}
class StoreImpl {
    constructor(value) {
        this._value = value;
        this._subscribers = [];
        this.readonly = new ReadonlySupplier(this);
    }
    _(value) {
        if (arguments.length !== 0) {
            const isDifferent = this._value !== value;
            this._value = value;
            if (isDifferent) {
                const callSubscribers = new CallSubscribers(this);
                callSubscribers._.apply(callSubscribers, arguments);
            }
        }
        return this._value;
    }
    subscribe(subscriber) {
        this._subscribers.push(subscriber);
        return new _Unsubscriber(this, subscriber);
    }
}
class ReadonlySupplier {
    constructor(store) {
        this._store = store;
    }
    _() {
        if (arguments.length > 0) {
            throw new Error('Setting value is not allowed');
        }
        return this._store._();
    }
    subscribe(subscriber) {
        return this._store.subscribe(subscriber);
    }
}
