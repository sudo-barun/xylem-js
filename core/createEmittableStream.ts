import EmittableStream from "../types/EmittableStream.js";
import Stream from "../types/Stream.js";
import Subscriber from "../types/Subscriber.js";
import Unsubscriber from "../types/Unsubscriber.js";
import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";

export default
function createEmittableStream<T>(): EmittableStream<T>
{
	return new EmittableStreamImpl();
}

class EmittableStreamImpl<T> implements EmittableStream<T>
{
	declare _subscribers: Subscriber<T>[];
	declare subscribeOnly: Stream<T>;

	constructor()
	{
		this._subscribers = [];
		this.subscribeOnly = new SubscribeOnlyStream(this);
	}

	_(value: T): void
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

class SubscribeOnlyStream<T> implements Stream<T>
{
	declare _source: EmittableStreamImpl<T>;

	constructor(source: EmittableStreamImpl<T>)
	{
		this._source = source;
	}

	subscribe(subscriber: Subscriber<T>): Unsubscriber
	{
		return this._source.subscribe(subscriber);
	}
}
