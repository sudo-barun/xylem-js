import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import Supplier from "../types/Supplier.js";
import Store from "../types/Store.js";
import Subscriber from "../types/Subscriber.js";
import Unsubscriber from "../types/Unsubscriber.js";
import _Unsubscriber from "../utilities/_internal/UnsubscriberImpl.js";

export default
function createStore<T> (value: T): Store<T>
{
	return new StoreImpl(value);
}

class StoreImpl<T> implements Store<T>
{
	declare _value: T;
	declare _subscribers: Subscriber<T>[];
	declare readonly: ReadonlySupplier<T>

	constructor(value: T)
	{
		this._value = value;
		this._subscribers = [];
		this.readonly = new ReadonlySupplier(this);
	}

	_(value?: T): T
	{
		if (arguments.length !== 0) {
			const isDifferent = this._value !== value
			this._value = value!;
			if (isDifferent) {
				const callSubscribers = new CallSubscribers(this);
				callSubscribers._.apply(callSubscribers, arguments as unknown as [T]);
			}
		}
		return this._value;
	}

	subscribe(subscriber: Subscriber<T>): Unsubscriber
	{
		this._subscribers.push(subscriber);
		return new _Unsubscriber(this, subscriber);
	}
}

class ReadonlySupplier<T> implements Supplier<T>
{
	declare _store: StoreImpl<T>;

	constructor(store: StoreImpl<T>)
	{
		this._store = store;
	}

	_(): T
	{
		if (arguments.length > 0) {
			throw new Error('Setting value is not allowed');
		}
		return this._store._();
	}

	subscribe(subscriber: Subscriber<T>): Unsubscriber
	{
		return this._store.subscribe(subscriber);
	}
}
