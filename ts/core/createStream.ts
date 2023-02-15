import SourceStream from "../types/SourceStream.js";
import Stream from "../types/Stream.js";
import Subscriber from "../types/Subscriber.js";
import Unsubscriber from "../types/Unsubscriber.js";

export default
function createStream<T>(): SourceStream<T>
{
	const subscribers: Subscriber<T>[] = [];

	const stream = function (value: T): void {
		subscribers.forEach(subscriber => {
			if (arguments.length) {
				subscriber(value as T);
			} else {
				(subscriber as Subscriber<void>)();
			}
		});
	};

	const removeSubscriber = function (subscriber: Subscriber<T>)
	{
		const index = subscribers.indexOf(subscriber);
		if (index !== -1) {
			subscribers.splice(index, 1);
		}
	};

	const subscribe = function (subscriber: Subscriber<T>): Unsubscriber
	{
		subscribers.push(subscriber);
		return function () {
			removeSubscriber(subscriber);
		};
	};

	stream.subscribe = subscribe;

	Object.defineProperty(stream, 'subscribers', { value: subscribers });

	const subscribeOnly: Stream<T> = {
		subscribe,
	};

	stream.subscribeOnly = subscribeOnly;
	Object.defineProperty(stream, 'subscribeOnly', { value: subscribeOnly });

	return stream;
}
