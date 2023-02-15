import Store from "../types/Store.js";
import Subscriber from "../types/Subscriber.js";
import Unsubscriber from "../types/Unsubscriber.js";

export default
function createProxy<T>(
	store: Store<T>,
	handleUnsubscription: (unsubscriber: Unsubscriber) => void
): Store<T>
{
	const subscribers: Subscriber<T>[] = [];
	const proxy = function () {
		return store.apply(null, arguments as any);
	};
	proxy._original = store;

	const unsubscribeFromOriginal = store.subscribe((value)=>{
		subscribers.forEach(subscriber => subscriber(value));
	});

	const removeSubscriber = function (subscriber: Subscriber<T>)
	{
		const index = subscribers.indexOf(subscriber);
		if (index === -1) {
			throw new Error('Subscriber already removed from the list of subscribers');
		}
		subscribers.splice(index, 1);
	};

	const subscribe = function (subscriber: Subscriber<T>)
	{
		subscribers.push(subscriber);
		return function () {
			removeSubscriber(subscriber);
		};
	};
	proxy.subscribe = subscribe;
	Object.defineProperty(proxy, 'subscribe', { value: subscribe });

	handleUnsubscription(unsubscribeFromOriginal);

	Object.defineProperty(proxy, 'source', { value: store });

	return proxy;
}
