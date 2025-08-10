import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import type Supplier from "../types/Supplier.js";
import type Subscriber from "../types/Subscriber.js";
import type SubscriberObject from "../types/SubscriberObject.js";
import type Unsubscriber from "../types/Unsubscriber.js";
import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";
import type HasLifecycle from "../types/HasLifecycle.js";

type MapperFunction<I,O> = (value: I) => O;
type MapperObject<I,O> = {
	_: (value: I) => O;
};
type Mapper<I,O> = MapperFunction<I,O> | MapperObject<I,O>;

export default
function map<I,O>(hasLifecycle: HasLifecycle, supplier: Supplier<I>, mapper: Mapper<I,O>): Supplier<O>

export default
function map<T>(hasLifecycle: HasLifecycle, supplier: Supplier<T>, mapper: Mapper<T,T>): Supplier<T>

export default
function map<I,O>(hasLifecycle: HasLifecycle, supplier: Supplier<I>, mapper: Mapper<I,O>): Supplier<O>
{
	return new MappedSupplier(hasLifecycle, supplier, mapper);
}

class MappedSupplier<I,O> implements Supplier<O>
{
	declare _hasLifecycle: HasLifecycle;
	declare _supplier: Supplier<I>;
	declare _mapper: Mapper<I,O>;
	declare _subscribers: Subscriber<O>[];

	constructor(hasLifecycle: HasLifecycle, supplier: Supplier<I>, mapper: Mapper<I,O>)
	{
		this._hasLifecycle = hasLifecycle;
		this._supplier = supplier;
		this._mapper = mapper;
		this._subscribers = [];

		hasLifecycle.beforeDetachFromDom.subscribe(
			supplier.subscribe(new StoreSubscriber(this, mapper))
		);
	}

	_(): O
	{
		if (typeof this._mapper === 'function') {
			return this._mapper(this._supplier._());
		} else {
			return this._mapper._(this._supplier._());
		}
	}

	_emit(value: O)
	{
		const callSubscribers = new CallSubscribers(this);
		callSubscribers._.apply(callSubscribers, arguments as unknown as [O]);
	}

	subscribe(subscriber: Subscriber<O>): Unsubscriber
	{
		this._subscribers.push(subscriber);
		return new UnsubscriberImpl(this, subscriber);
	}

	get _value()
	{
		return this._();
	}
}

class StoreSubscriber<I,O> implements SubscriberObject<I>
{
	declare _mappedStore: MappedSupplier<I,O>;
	declare _mapper: Mapper<I,O>;

	constructor(mappedStore: MappedSupplier<I,O>, mapper: Mapper<I,O>)
	{
		this._mappedStore = mappedStore;
		this._mapper = mapper;
	}

	_(value: I)
	{
		if (typeof this._mapper === 'function') {
			this._mappedStore._emit(this._mapper(value));
		} else {
			this._mappedStore._emit(this._mapper._(value));
		}
	}
}
