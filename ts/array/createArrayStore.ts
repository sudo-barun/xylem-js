import ArrayMutateAction from "../types/ArrayMutateAction.js";
import ArrayMutation from "../types/ArrayMutation.js";
import ArrayStore from "../types/ArrayStore.js";
import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import createEmittableStream from "../core/createEmittableStream.js";
import createStore from "../core/createStore.js";
import Supplier from "../types/Supplier.js";
import EmittableStream from "../types/EmittableStream.js";
import Store from "../types/Store.js";
import Subscriber from "../types/Subscriber.js";
import Unsubscriber from "../types/Unsubscriber.js";
import _Unsubscriber from "../utilities/_internal/UnsubscriberImpl.js";

export default
function createArrayStore<T> (value: Array<T>): ArrayStore<T>
{
	return new ArrayStoreImpl(value);
}

class ArrayStoreImpl<T> implements ArrayStore<T>
{
	declare _value: Array<T>;
	declare _subscribers: Subscriber<T[]>[];

	declare index$Array: Store<number>[];
	declare length$: ArrayLengthStore;
	declare mutation: EmittableStream<ArrayMutation<T,unknown[]>>;
	declare readonly: ReadonlySupplier<T>;

	constructor(value: Array<T>)
	{
		if (! (value instanceof Array)) {
			throw new Error('Value of ArrayStore must be an array.');
		}

		this._value = value;
		this._subscribers = [];

		this.index$Array = value.map((_, index) => createStore(index));
		this.length$ = new ArrayLengthStore(this);
		this.mutation = createEmittableStream();
		this.readonly = new ReadonlySupplier(this);
	}

	_(newValue?: Array<T>): Array<T>
	{
		if (arguments.length !== 0) {
			if (! (newValue instanceof Array)) {
				throw new Error('Value of ArrayStore must be an array.');
			}
			const isDifferent = this._value !== newValue
			this._value = newValue!;
			if (isDifferent) {

				this.index$Array = newValue.map((_, index) => createStore(index));
				this.length$._emit(newValue.length);


				const callSubscribers = new CallSubscribers(this);
				callSubscribers._.apply(callSubscribers, arguments as unknown as [T[]]);
			}
		}
		return this._value;
	}

	subscribe(subscriber: Subscriber<T[]>): Unsubscriber
	{
		this._subscribers.push(subscriber);
		return new _Unsubscriber(this, subscriber);
	}

	mutate<MutationArgs extends unknown[]>(action: ArrayMutateAction<MutationArgs>, ...mutationArgs: MutationArgs): void
	{
		// The mutation argument can change, for example index$ value can change.
		// So, initial value of arguments is returned from action and used.
		const otherArgs_ = action._<T>(this._value, this.index$Array, ...mutationArgs);
		this.mutation._([ this._value, action as ArrayMutateAction<unknown[]>, ...otherArgs_ ]);
		this.length$._emit(this.length$._());
	}
}

class ReadonlySupplier<T> implements Supplier<T[]>
{
	declare _store: ArrayStoreImpl<T>;

	constructor(store: ArrayStoreImpl<T>)
	{
		this._store = store;
	}

	_(): T[]
	{
		if (arguments.length > 0) {
			throw new Error('Setting value is not allowed');
		}
		return this._store._();
	}

	subscribe(subscriber: Subscriber<T[]>): Unsubscriber
	{
		this._store._subscribers.push(subscriber);
		return new _Unsubscriber(this._store, subscriber);
	}
}

class ArrayLengthStore implements Supplier<number>
{
	declare _arrayStore: Supplier<unknown[]>;
	declare _subscribers: Subscriber<number>[];

	constructor(arrayStore: Supplier<unknown[]>)
	{
		this._arrayStore = arrayStore;
		this._subscribers = [];
	}

	_(): number
	{
		return this._arrayStore._().length;
	}

	subscribe(subscriber: Subscriber<number>): Unsubscriber
	{
		this._subscribers.push(subscriber);
		return new _Unsubscriber(this, subscriber);
	}

	_emit(value: number)
	{
		const callSubscribers = new CallSubscribers(this);
		callSubscribers._.apply(callSubscribers, arguments as unknown as [number]);
	}
}
