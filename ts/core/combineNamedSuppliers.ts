import Supplier from "../types/Supplier.js";
import Subscriber from "../types/Subscriber.js";
import SubscriberObject from "../types/SubscriberObject.js";
import Unsubscriber from "../types/Unsubscriber.js";
import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";

export default
function combineNamedSuppliers<T extends {[prop: string]: any}>(suppliers: {[prop: string]: Supplier<any>}): Supplier<T>
{
	return new CombinedSupplier<T>(suppliers);
}

class CombinedSupplier<T extends object> implements Supplier<T>
{
	declare _stores: {[prop: string]: Supplier<any>}
	declare _subscribers: Subscriber<T>[];

	constructor(stores: {[prop: string]: Supplier<any>})
	{
		this._stores = stores;
		this._subscribers = [];

		Object.keys(stores).forEach(
			(key) => stores[key].subscribe(new StoreSubscriber(this, key))
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
		const callSubscribers = new CallSubscribers(this);
		callSubscribers._.apply(callSubscribers, arguments as any);
	}
}

class StoreSubscriber<T extends object> implements SubscriberObject<any>
{
	declare _combinedStore: CombinedSupplier<T>;
	declare _key: string;

	constructor(combinedStore: CombinedSupplier<T>, key: string)
	{
		this._combinedStore = combinedStore;
		this._key = key;
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
