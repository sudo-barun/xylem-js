import type Supplier from "../types/Supplier.js";
import type Subscriber from "../types/Subscriber.js";
import type SubscriberObject from "../types/SubscriberObject.js";
import type Unsubscriber from "../types/Unsubscriber.js";
import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";
import type HasLifecycle from "../types/HasLifecycle.js";

type TypeOfSupplier<T> = T extends Supplier<infer U> ? U : never;

type ArrayOfSupplierToSupplierOfArray<T extends Array<Supplier<unknown>>> = {
	[K in keyof T]: TypeOfSupplier<T[K]>
};

export default
function combineSuppliers<A,T extends [Supplier<A>]>(hasLifecycle: HasLifecycle, suppliers: T): Supplier<ArrayOfSupplierToSupplierOfArray<T>>
export default
function combineSuppliers<A,B,T extends [Supplier<A>,Supplier<B>]>(hasLifecycle: HasLifecycle, suppliers: T): Supplier<ArrayOfSupplierToSupplierOfArray<T>>
export default
function combineSuppliers<A,B,C,T extends [Supplier<A>,Supplier<B>,Supplier<C>]>(hasLifecycle: HasLifecycle, suppliers: T): Supplier<ArrayOfSupplierToSupplierOfArray<T>>
export default
function combineSuppliers<A,B,C,D,T extends [Supplier<A>,Supplier<B>,Supplier<C>,Supplier<D>]>(hasLifecycle: HasLifecycle, suppliers: T): Supplier<ArrayOfSupplierToSupplierOfArray<T>>
export default
function combineSuppliers<A,B,C,D,E,T extends [Supplier<A>,Supplier<B>,Supplier<C>,Supplier<D>,Supplier<E>]>(hasLifecycle: HasLifecycle, suppliers: T): Supplier<ArrayOfSupplierToSupplierOfArray<T>>
export default
function combineSuppliers<T extends Array<Supplier<unknown>>>(hasLifecycle: HasLifecycle, suppliers: T): Supplier<ArrayOfSupplierToSupplierOfArray<T>>
export default
function combineSuppliers<T extends Array<Supplier<unknown>>>(hasLifecycle: HasLifecycle, suppliers: T): Supplier<ArrayOfSupplierToSupplierOfArray<T>>
{
	return new CombinedSupplier(hasLifecycle, suppliers);
}

class CombinedSupplier<T extends Array<Supplier<unknown>>> implements Supplier<ArrayOfSupplierToSupplierOfArray<T>>
{
	declare _suppliers: T;
	declare _subscribers: Array<Subscriber<ArrayOfSupplierToSupplierOfArray<T>>>;

	constructor(hasLifecycle: HasLifecycle, suppliers: T)
	{
		this._suppliers = suppliers;
		this._subscribers = [];

		for (let index = 0; index < suppliers.length; index++) {
			const supplier = suppliers[index];

			hasLifecycle.beforeDetachFromDom.subscribe(
				supplier.subscribe(new StoreSubscriber(this, index))
			);
		}
	}

	_(): ArrayOfSupplierToSupplierOfArray<T>
	{
		return this._suppliers.map((store) => store._()) as ArrayOfSupplierToSupplierOfArray<T>;
	}

	subscribe(subscriber: Subscriber<ArrayOfSupplierToSupplierOfArray<T>>): Unsubscriber
	{
		this._subscribers.push(subscriber);
		return new UnsubscriberImpl(this, subscriber);
	}

	_emit(value: ArrayOfSupplierToSupplierOfArray<T>)
	{
		const callSubscribers = new CallSubscribers(this);
		callSubscribers._.apply(callSubscribers, arguments as unknown as [ArrayOfSupplierToSupplierOfArray<T>]);
	}

	get _value()
	{
		return this._();
	}
}

class StoreSubscriber<T extends Array<Supplier<unknown>>> implements SubscriberObject<unknown>
{
	declare _combinedStore: CombinedSupplier<T>;
	declare _index: number;

	constructor(combinedStore: CombinedSupplier<T>, index: number)
	{
		this._combinedStore = combinedStore;
		this._index = index;
	}

	_(value: unknown)
	{
		const mappedValue = this._combinedStore._suppliers.map((store, index) => {
			if (index === this._index) {
				return value;
			} else {
				return store._();
			}
		});
		this._combinedStore._emit(mappedValue as ArrayOfSupplierToSupplierOfArray<T>);
	}
}
