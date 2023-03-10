import Emitter from "../types/Emitter.js";
import ProxyStream from "../types/ProxyStream.js";
import Subscriber from "../types/Subscriber.js";
import Unsubscriber from "../types/Unsubscriber.js";

export default
function createStream<T>(
	callback: (emitter: Emitter<T>) => Unsubscriber
): ProxyStream<T>
{
	const subscribers: Subscriber<T>[] = [];

	const emitter = (value: T) => {
		subscribers.forEach(subscriber => subscriber(value));
	}
	const unsubscribeFromSource = callback(emitter);

	const removeSubscriber = function (subscriber: Subscriber<T>)
	{
		const index = subscribers.indexOf(subscriber);
		if (index !== -1) {
			subscribers.splice(index, 1);
		}
	};

	const subscribe = function (subscriber: Subscriber<T>)
	{
		subscribers.push(subscriber);
		return function () {
			removeSubscriber(subscriber);
		};
	};

	const stream = {
		subscribe,
		unsubscribe: unsubscribeFromSource,
	};

	Object.defineProperty(stream, 'subscribe', { value: stream.subscribe });
	Object.defineProperty(stream, 'unsubscribe', { value: stream.unsubscribe });

	return stream;
}
