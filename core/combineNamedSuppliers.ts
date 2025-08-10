import type Supplier from "../types/Supplier.js";
import type Subscriber from "../types/Subscriber.js";
import type SubscriberObject from "../types/SubscriberObject.js";
import type Unsubscriber from "../types/Unsubscriber.js";
import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";
import type HasLifecycle from "../types/HasLifecycle.js";

type TypeOfSupplier<T> = T extends Supplier<infer U> ? U : never;

type ObjectOfSupplierToSupplierOfObject<T extends { [key: string]: Supplier<unknown> }> = {
	[K in keyof T]: TypeOfSupplier<T[K]>
};

export default
function combineNamedSuppliers<T extends {[key: string]: Supplier<unknown>}>(hasLifecycle: HasLifecycle, suppliers: T): Supplier<ObjectOfSupplierToSupplierOfObject<T>>
{
	return new CombinedSupplier(hasLifecycle, suppliers);
}

class CombinedSupplier<T extends {[key: string]: Supplier<unknown>}> implements Supplier<ObjectOfSupplierToSupplierOfObject<T>>
{
	declare _stores: T
	declare _subscribers: Array<Subscriber<ObjectOfSupplierToSupplierOfObject<T>>>;

	constructor(hasLifecycle: HasLifecycle, stores: T)
	{
		this._stores = stores;
		this._subscribers = [];

		for (const key of Object.keys(stores)) {
			hasLifecycle.beforeDetachFromDom.subscribe(
				stores[key].subscribe(new StoreSubscriber(this, key))
			);
		}
	}

	_(): ObjectOfSupplierToSupplierOfObject<T>
	{
		return Object.keys(this._stores).reduce((acc, key) => {
			acc[key] = this._stores[key]._();
			return acc;
		}, {} as {[key: string] :unknown}) as ObjectOfSupplierToSupplierOfObject<T>;
	}

	subscribe(subscriber: Subscriber<ObjectOfSupplierToSupplierOfObject<T>>): Unsubscriber
	{
		this._subscribers.push(subscriber);
		return new UnsubscriberImpl(this, subscriber);
	}

	_emit(value: ObjectOfSupplierToSupplierOfObject<T>)
	{
		const callSubscribers = new CallSubscribers(this);
		callSubscribers._.apply(callSubscribers, arguments as unknown as [ObjectOfSupplierToSupplierOfObject<T>]);
	}

	get _value()
	{
		return this._();
	}
}

class StoreSubscriber<T extends {[key: string]: Supplier<unknown>}> implements SubscriberObject<unknown>
{
	declare _combinedStore: CombinedSupplier<T>;
	declare _key: string;

	constructor(combinedStore: CombinedSupplier<T>, key: string)
	{
		this._combinedStore = combinedStore;
		this._key = key;
	}

	_(value: unknown)
	{
		const mappedValue = Object.keys(this._combinedStore._stores).reduce((acc, key) => {
			if (key === this._key) {
				acc[key] = value;
			} else {
				acc[key] = this._combinedStore._stores[key]._();
			}
			return acc;
		}, {} as {[key: string]: unknown});

		this._combinedStore._emit(mappedValue as ObjectOfSupplierToSupplierOfObject<T>);
	}
}
