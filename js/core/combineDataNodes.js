import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";
export default function combineDataNodes(dataNodes) {
    return new CombinedDataNode(dataNodes);
}
class CombinedDataNode {
    constructor(dataNodes) {
        this._dataNodes = dataNodes;
        this._subscribers = [];
        dataNodes.forEach((dataNode, index) => dataNode.subscribe(new StoreSubscriber(this, index)));
    }
    _() {
        return this._dataNodes.map((store) => store._());
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
