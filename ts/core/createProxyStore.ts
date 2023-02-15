import Getter from "../types/Getter.js";
import ProxyStore from "../types/ProxyStore.js";
import Stream from "../types/Stream.js";
import Subscriber from "../types/Subscriber.js";

export default
function createProxyStore<T>(
	getter: Getter<T>,
	stream: Stream<T>
): ProxyStore<T>
{
	const subscribers: Subscriber<T>[] = [];
	const proxyStore = () => getter();

	const unsubscribeFromSource = stream.subscribe((value) => {
		subscribers.forEach(subscriber => subscriber(value));
	});

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

	proxyStore.subscribe = subscribe;
	Object.defineProperty(proxyStore, 'subscribe', { value: subscribe });

	Object.defineProperty(proxyStore, 'source', { value: { getter, stream } });

	proxyStore.unsubscribeFromSource = unsubscribeFromSource;
	Object.defineProperty(proxyStore, 'unsubscribeFromSource', { value: unsubscribeFromSource });

	return proxyStore;
}
