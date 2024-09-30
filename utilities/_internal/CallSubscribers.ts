import StreamWithSubscribers from "../../types/_internal/StreamWithSubscribers.js";

export default
class CallSubscribers<T>
{
	declare _stream: StreamWithSubscribers<T>

	constructor(stream: StreamWithSubscribers<T>)
	{
		this._stream = stream;
	}

	_(value?: T): void
	{
		for (const subscriber of this._stream._subscribers) {
			if (typeof subscriber === 'function') {
				subscriber.apply(null, arguments as unknown as [T]);
			} else {
				subscriber._.apply(subscriber, arguments as unknown as [T]);
			}
		}
	}
}
