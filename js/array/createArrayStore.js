import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import createEmittableStream from "../core/createEmittableStream.js";
import createStore from "../core/createStore.js";
import _Unsubscriber from "../utilities/_internal/UnsubscriberImpl.js";
export default function createArrayStore(value) {
    return new ArrayStoreImpl(value);
}
class ArrayStoreImpl {
    constructor(value) {
        if (!(value instanceof Array)) {
            throw new Error('Value of ArrayStore must be an array.');
        }
        this._value = value;
        this._subscribers = [];
        this.index$Array = value.map((_, index) => createStore(index));
        this.length$ = new ArrayLengthStore(this);
        this.mutation = createEmittableStream();
        this.readonly = new ReadonlySupplier(this);
    }
    _(newValue) {
        if (arguments.length !== 0) {
            if (!(newValue instanceof Array)) {
                throw new Error('Value of ArrayStore must be an array.');
            }
            const isDifferent = this._value !== newValue;
            this._value = newValue;
            if (isDifferent) {
                this.index$Array = newValue.map((_, index) => createStore(index));
                this.length$._emit(newValue.length);
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
    mutate(action, ...mutationArgs) {
        // The mutation argument can change, for example index$ value can change.
        // So, initial value of arguments is returned from action and used.
        const otherArgs_ = action._(this._value, this.index$Array, ...mutationArgs);
        this.mutation._([this._value, action, ...otherArgs_]);
        this.length$._emit(this.length$._());
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
        this._store._subscribers.push(subscriber);
        return new _Unsubscriber(this._store, subscriber);
    }
}
class ArrayLengthStore {
    constructor(arrayStore) {
        this._arrayStore = arrayStore;
        this._subscribers = [];
    }
    _() {
        return this._arrayStore._().length;
    }
    subscribe(subscriber) {
        this._subscribers.push(subscriber);
        return new _Unsubscriber(this, subscriber);
    }
    _emit(value) {
        const callSubscribers = new CallSubscribers(this);
        callSubscribers._.apply(callSubscribers, arguments);
    }
}
