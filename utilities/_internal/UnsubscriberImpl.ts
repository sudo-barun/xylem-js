import StreamWithSubscribers from "../../types/_internal/StreamWithSubscribers";
import Subscriber from "../../types/Subscriber";
import Unsubscriber from "../../types/Unsubscriber";

export default
class UnsubscriberImpl<T> implements Unsubscriber
{
	declare _stream: StreamWithSubscribers<T>;
	declare _subscriber: Subscriber<T>;

	constructor(stream: StreamWithSubscribers<T>, subscriber: Subscriber<T>)
	{
		this._stream = stream;
		this._subscriber = subscriber;
	}

	_(): void
	{
		const index = this._stream._subscribers.indexOf(this._subscriber);
		if (index !== -1) {
			this._stream._subscribers.splice(index, 1);
		} else {
			throw new Error('Failed to remove subscriber as it is not in the list of subscribers.');
		}
	}
}
