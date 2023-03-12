import DataNode from "../types/DataNode.js";
import Subscriber from "../types/Subscriber.js";
import SubscriberObject from "../types/SubscriberObject.js";
import Unsubscriber from "../types/Unsubscriber.js";
import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";

export default
function combineDataNodes<T extends Array<any>>(dataNodes: Array<DataNode<any>>): DataNode<T>
{
	return new CombinedDataNode(dataNodes);
}

class CombinedDataNode<T extends Array<any>> implements DataNode<T>
{
	declare _dataNodes: DataNode<any>[];
	declare _subscribers: Subscriber<T>[];

	constructor(stores: DataNode<any>[])
	{
		this._dataNodes = stores;
		this._subscribers = [];

		stores.forEach(
			(_, index) => new StoreSubscriber(this, index)
		);
	}

	_(): T
	{
		return this._dataNodes.map((store) => store._()) as T;
	}

	subscribe(subscriber: Subscriber<T>): Unsubscriber
	{
		this._subscribers.push(subscriber);
		return new UnsubscriberImpl(this, subscriber);
	}

	_emit(value: T)
	{
		this._subscribers.forEach((subscriber) => {
			if (subscriber instanceof Function) {
				subscriber(value);
			} else {
				subscriber._(value);
			}
		});
	}
}

class StoreSubscriber<T extends Array<any>> implements SubscriberObject<any>
{
	declare _combinedStore: CombinedDataNode<T>;
	declare _index: number;

	constructor(combinedStore: CombinedDataNode<T>, index: number)
	{
		this._combinedStore = combinedStore;
		this._index = index;
		this._combinedStore._dataNodes[index].subscribe(this);
	}

	_(value: any)
	{
		const mappedValue = this._combinedStore._dataNodes.map((store, index) => {
			if (index === this._index) {
				return value;
			} else {
				return store._();
			}
		});
		this._combinedStore._emit(mappedValue as T);
	}
}
