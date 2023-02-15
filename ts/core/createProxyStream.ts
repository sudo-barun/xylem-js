import ProxyStream from "../types/ProxyStream.js";
import SourceStream from "../types/SourceStream.js";
import Subscriber from "../types/Subscriber.js";
import Unsubscriber from "../types/Unsubscriber.js";
import createStream from "./createStream.js";

export default
function createProxyStream<T>(
	callback: (sourceStream: SourceStream<T>) => Unsubscriber
): ProxyStream<T>
{
	const subscribers: Subscriber<T>[] = [];

	const sourceStream = createStream<T>();
	const unsubscribeFromSource = callback(sourceStream);

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

	sourceStream.subscribe((value) => {
		subscribers.forEach(subscriber => subscriber(value));
	});

	const proxyStream = {
		subscribe,
		unsubscribe: unsubscribeFromSource,
	};

	Object.defineProperty(proxyStream, 'subscribe', { value: proxyStream.subscribe });
	Object.defineProperty(proxyStream, 'unsubscribe', { value: proxyStream.unsubscribe });

	return proxyStream;
}
