import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import Supplier from "../types/Supplier.js";
import Subscriber from "../types/Subscriber.js";
import SubscriberObject from "../types/SubscriberObject.js";
import Unsubscriber from "../types/Unsubscriber.js";
import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";

type MapperFunction<I,O> = (value: I) => O;
type MapperObject<I,O> = {
	_: (value: I) => O;
};
type Mapper<I,O> = MapperFunction<I,O> | MapperObject<I,O>;

export default
function map<T>(supplier: Supplier<T>, mapper: Mapper<T,T>): Supplier<T>

export default
function map<I,O>(supplier: Supplier<I>, mapper: Mapper<I,O>): Supplier<O>

export default
function map<I,O>(supplier: Supplier<I>, mapper: Mapper<I,O>): Supplier<O>
{
	return new MappedSupplier(supplier, mapper);
}

class MappedSupplier<I,O> implements Supplier<O>
{
	declare _supplier: Supplier<I>;
	declare _mapper: Mapper<I,O>;
	declare _subscribers: Subscriber<O>[];

	constructor(supplier: Supplier<I>, mapper: Mapper<I,O>)
	{
		this._supplier = supplier;
		this._mapper = mapper;
		this._subscribers = [];

		supplier.subscribe(new StoreSubscriber(this, mapper));
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
