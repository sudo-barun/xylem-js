import DataNode from "../types/DataNode.js";
import Getter from "../types/Getter.js";
import Stream from "../types/Stream.js";
import Subscriber from "../types/Subscriber.js";
import SubscriberObject from "../types/SubscriberObject.js";
import Unsubscriber from "../types/Unsubscriber.js";
import _Unsubscriber from "../utilities/_internal/UnsubscriberImpl.js";

export default
function createDataNode<T>(
	getter: Getter<T>,
	stream: Stream<T>
): DataNode<T>
{
	return new DataNodeImpl(getter, stream);
}

class DataNodeImpl<T> implements DataNode<T>
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
		this._subscribers.forEach((subscriber) => {
			if (subscriber instanceof Function) {
				subscriber(value);
			} else {
				subscriber._(value);
			}
		});
	}

	subscribe(subscriber: Subscriber<T>): Unsubscriber
	{
		this._subscribers.push(subscriber);
		return new _Unsubscriber(this, subscriber);
	}
}

class StreamSubscriber<T> implements SubscriberObject<T>
{
	declare _dataNode: DataNodeImpl<T>

	constructor(dataNode: DataNodeImpl<T>)
	{
		this._dataNode = dataNode;
	}

	_(value: T): void
	{
		this._dataNode._emit(value);
	}
}
