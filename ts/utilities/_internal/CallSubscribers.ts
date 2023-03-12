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
		this._stream._subscribers.forEach(subscriber => {
			if (typeof subscriber === 'function') {
				subscriber.apply(null, arguments as any);
			} else {
				subscriber._.apply(subscriber, arguments as any);
			}
		});
	}
}
