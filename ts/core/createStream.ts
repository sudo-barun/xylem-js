import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import Emitter from "../types/Emitter.js";
import ProxyStream from "../types/ProxyStream.js";
import Subscriber from "../types/Subscriber.js";
import Unsubscriber from "../types/Unsubscriber.js";
import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";

export default
function createStream<T>(
	callback: (emitter: Emitter<T>) => Unsubscriber
): ProxyStream<T>
{
	return new StreamImpl(callback);
}

class StreamImpl<T> implements ProxyStream<T>
{
	declare _callback: (emitter: Emitter<T>) => Unsubscriber;
	declare _subscribers: Subscriber<T>[];
	declare _unsubscriber: Unsubscriber;

	constructor(callback: (emitter: Emitter<T>) => Unsubscriber)
	{
		this._callback = callback;
		this._subscribers = [];

		const emitter = new EmitterImpl(this);

		this._unsubscriber = callback(emitter);
	}

	subscribe(subscriber: Subscriber<T>): Unsubscriber
	{
		this._subscribers.push(subscriber);
		return new UnsubscriberImpl(this, subscriber);
	}

	_emit(value: T)
	{
		const callSubscribers = new CallSubscribers(this);
		callSubscribers._.apply(callSubscribers, arguments as unknown as [T]);
	}

	unsubscribe(): void
	{
		this._unsubscriber._();
	}
}

class EmitterImpl<T> implements Emitter<T>
{
	declare _stream: StreamImpl<T>;

	constructor(stream: StreamImpl<T>)
	{
		this._stream = stream;
	}

	_(value: T): void
	{
		this._stream._emit(value);
	}
}
