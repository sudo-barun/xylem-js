import Supplier from "../types/Supplier.js";
import Subscriber from "../types/Subscriber.js";
import SubscriberObject from "../types/SubscriberObject.js";
import Unsubscriber from "../types/Unsubscriber.js";
import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";

export default
function combineSuppliers<T extends Array<any>>(suppliers: Array<Supplier<any>>): Supplier<T>
{
	return new CombinedSupplier(suppliers);
}

class CombinedSupplier<T extends Array<any>> implements Supplier<T>
{
	declare _suppliers: Supplier<any>[];
	declare _subscribers: Subscriber<T>[];

	constructor(suppliers: Supplier<any>[])
	{
		this._suppliers = suppliers;
		this._subscribers = [];

		suppliers.forEach(
			(supplier, index) => supplier.subscribe(new StoreSubscriber(this, index))
		);
	}

	_(): T
	{
		return this._suppliers.map((store) => store._()) as T;
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
	declare _combinedStore: CombinedSupplier<T>;
	declare _index: number;

	constructor(combinedStore: CombinedSupplier<T>, index: number)
	{
		this._combinedStore = combinedStore;
		this._index = index;
	}

	_(value: any)
	{
		const mappedValue = this._combinedStore._suppliers.map((store, index) => {
			if (index === this._index) {
				return value;
			} else {
				return store._();
			}
		});
		this._combinedStore._emit(mappedValue as T);
	}
}
