import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";
export default function combineNamedSuppliers(suppliers) {
    return new CombinedSupplier(suppliers);
}
class CombinedSupplier {
    constructor(stores) {
        this._stores = stores;
        this._subscribers = [];
        for (const key of Object.keys(stores)) {
            stores[key].subscribe(new StoreSubscriber(this, key));
        }
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
        const callSubscribers = new CallSubscribers(this);
        callSubscribers._.apply(callSubscribers, arguments);
    }
}
class StoreSubscriber {
    constructor(combinedStore, key) {
        this._combinedStore = combinedStore;
        this._key = key;
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
