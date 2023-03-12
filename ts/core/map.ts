import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import DataNode from "../types/DataNode.js";
import Subscriber from "../types/Subscriber.js";
import SubscriberObject from "../types/SubscriberObject.js";
import Unsubscriber from "../types/Unsubscriber.js";
import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";

export default
function map<T>(dataNode: DataNode<T>, callback: (value: T) => T): DataNode<T>

export default
function map<I,O>(dataNode: DataNode<I>, callback: (value: I) => O): DataNode<O>

export default
function map<I,O>(dataNode: DataNode<I>, callback: (value: I) => O): DataNode<O>
{
	return new MappedDataNode(dataNode, callback);
}

class MappedDataNode<I,O> implements DataNode<O>
{
	declare _store: DataNode<I>;
	declare _mapper: (value: I) => O;
	declare _subscribers: Subscriber<O>[];

	constructor(store: DataNode<I>, mapper: (value: I) => O)
	{
		this._store = store;
		this._mapper = mapper;
		this._subscribers = [];

		store.subscribe(new StoreSubscriber(this, mapper));
	}

	_(): O
	{
		return this._mapper(this._store._());
	}

	_emit(value: O)
	{
		const callSubscribers = new CallSubscribers(this);
		callSubscribers._.apply(callSubscribers, arguments as any);
	}

	subscribe(subscriber: Subscriber<O>): Unsubscriber
	{
		this._subscribers.push(subscriber);
		return new UnsubscriberImpl(this, subscriber);
	}
}

class StoreSubscriber<I,O> implements SubscriberObject<I>
{
	declare _mappedStore: MappedDataNode<I,O>;
	declare _mapper: (value: I) => O;

	constructor(mappedStore: MappedDataNode<I,O>, mapper: (value: I) => O)
	{
		this._mappedStore = mappedStore;
		this._mapper = mapper;
	}

	_(value: I)
	{
		this._mappedStore._emit(this._mapper(value));
	}
}
