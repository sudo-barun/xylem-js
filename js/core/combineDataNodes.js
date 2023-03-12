import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";
export default function combineDataNodes(dataNodes) {
    return new CombinedDataNode(dataNodes);
}
class CombinedDataNode {
    constructor(stores) {
        this._dataNodes = stores;
        this._subscribers = [];
        stores.forEach((_, index) => new StoreSubscriber(this, index));
    }
    _() {
        return this._dataNodes.map((store) => store._());
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
    constructor(combinedStore, index) {
        this._combinedStore = combinedStore;
        this._index = index;
        this._combinedStore._dataNodes[index].subscribe(this);
    }
    _(value) {
        const mappedValue = this._combinedStore._dataNodes.map((store, index) => {
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
