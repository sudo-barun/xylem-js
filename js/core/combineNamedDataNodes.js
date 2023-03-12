import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";
export default function combineNamedDataNodes(nodes) {
    return new CombinedStore(nodes);
}
class CombinedStore {
    _stores;
    _subscribers;
    constructor(stores) {
        this._stores = stores;
        this._subscribers = [];
        Object.keys(stores).forEach((key) => new StoreSubscriber(this, key));
    }
    _() {
        return Object.keys(this._stores).reduce((acc, key) => {
            acc[key] = this._stores[key]._();
            return acc;
        }, {});
    }
    subscribe(subscriber) {
        this._subscribers.push(subscriber);
        return new UnsubscriberImpl(this, subscriber);
    }
    _emit(value) {
        this._subscribers.forEach((subscriber) => {
            if (subscriber instanceof Function) {
                subscriber(value);
            }
            else {
                subscriber._(value);
            }
        });
    }
}
class StoreSubscriber {
    _combinedStore;
    _key;
    constructor(combinedStore, key) {
        this._combinedStore = combinedStore;
        this._key = key;
        this._combinedStore._stores[key].subscribe(this);
    }
    _(value) {
        const mappedValue = Object.keys(this._combinedStore._stores).reduce((acc, key) => {
            if (key === this._key) {
                acc[key] = value;
            }
            else {
                acc[key] = this._combinedStore._stores[key]._();
            }
            return acc;
        }, {});
        this._combinedStore._emit(mappedValue);
    }
}
