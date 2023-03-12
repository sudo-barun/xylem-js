import DataNode from "../types/DataNode.js";
import Subscriber from "../types/Subscriber.js";
import SubscriberObject from "../types/SubscriberObject.js";
import Unsubscriber from "../types/Unsubscriber.js";
import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";

export default
function combineNamedDataNodes<T extends {[prop: string]: any}>(nodes: {[prop: string]: DataNode<any>}): DataNode<T>
{
	return new CombinedStore<T>(nodes);
}

class CombinedStore<T extends object> implements DataNode<T>
{
	_stores: {[prop: string]: DataNode<any>}
	_subscribers: Subscriber<T>[];

	constructor(stores: {[prop: string]: DataNode<any>})
	{
		this._stores = stores;
		this._subscribers = [];

		Object.keys(stores).forEach(
			(key) => new StoreSubscriber(this, key)
		);
	}

	_(): T
	{
		return Object.keys(this._stores).reduce((acc, key) => {
			acc[key] = this._stores[key]._();
			return acc;
		}, {} as {[prop: string]:any}) as T;
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

class StoreSubscriber<T extends object> implements SubscriberObject<any>
{
	_combinedStore: CombinedStore<T>;
	_key: string;

	constructor(combinedStore: CombinedStore<T>, key: string)
	{
		this._combinedStore = combinedStore;
		this._key = key;
		this._combinedStore._stores[key].subscribe(this);
	}

	_(value: any)
	{
		const mappedValue = Object.keys(this._combinedStore._stores).reduce((acc, key) => {
			if (key === this._key) {
				acc[key] = value;
			} else {
				acc[key] = this._combinedStore._stores[key]._();
			}
			return acc;
		}, {} as {[key: string]: any});

		this._combinedStore._emit(mappedValue as T);
	}
}
