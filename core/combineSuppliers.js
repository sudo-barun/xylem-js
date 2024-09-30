import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";
export default function combineSuppliers(suppliers) {
    return new CombinedSupplier(suppliers);
}
class CombinedSupplier {
    constructor(suppliers) {
        this._suppliers = suppliers;
        this._subscribers = [];
        for (let index = 0; index < suppliers.length; index++) {
            const supplier = suppliers[index];
            supplier.subscribe(new StoreSubscriber(this, index));
        }
    }
    _() {
        return this._suppliers.map((store) => store._());
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
    constructor(combinedStore, index) {
        this._combinedStore = combinedStore;
        this._index = index;
    }
    _(value) {
        const mappedValue = this._combinedStore._suppliers.map((store, index) => {
            if (index === this._index) {
                return value;
            }
            else {
                return store._();
            }
        });
        this._combinedStore._emit(mappedValue);
    }
}
