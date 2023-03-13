import DataNode from "../types/DataNode.js";
import Subscriber from "../types/Subscriber.js";
import SubscriberObject from "../types/SubscriberObject.js";
import Unsubscriber from "../types/Unsubscriber.js";
import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
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

	constructor(dataNodes: DataNode<any>[])
	{
		this._dataNodes = dataNodes;
		this._subscribers = [];

		dataNodes.forEach(
			(dataNode, index) => dataNode.subscribe(new StoreSubscriber(this, index))
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
		const callSubscribers = new CallSubscribers(this);
		callSubscribers._.apply(callSubscribers, arguments as any);
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
