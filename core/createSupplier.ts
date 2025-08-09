import type Supplier from "../types/Supplier.js";
import type Getter from "../types/Getter.js";
import type Stream from "../types/Stream.js";
import type Subscriber from "../types/Subscriber.js";
import type SubscriberObject from "../types/SubscriberObject.js";
import type Unsubscriber from "../types/Unsubscriber.js";
import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";

export default
function createSupplier<T>(
	getter: Getter<T>,
	stream: Stream<T>
): Supplier<T>
{
	return new SupplierImpl(getter, stream);
}

class SupplierImpl<T> implements Supplier<T>
{
	declare _getter: Getter<T>;
	declare _stream: Stream<T>;
	declare _subscribers: Subscriber<T>[];

	constructor(getter: Getter<T>, stream: Stream<T>)
	{
		this._getter = getter;
		this._stream = stream;
		this._subscribers = [];

		stream.subscribe(new StreamSubscriber(this));
	}

	_(): T
	{
		return this._getter._();
	}

	_emit(value: T)
	{
		const callSubscribers = new CallSubscribers(this);
		callSubscribers._.apply(callSubscribers, arguments as unknown as [T]);
	}

	subscribe(subscriber: Subscriber<T>): Unsubscriber
	{
		this._subscribers.push(subscriber);
		return new UnsubscriberImpl(this, subscriber);
	}
}

class StreamSubscriber<T> implements SubscriberObject<T>
{
	declare _supplier: SupplierImpl<T>

	constructor(supplier: SupplierImpl<T>)
	{
		this._supplier = supplier;
	}

	_(value: T): void
	{
		this._supplier._emit(value);
	}
}
