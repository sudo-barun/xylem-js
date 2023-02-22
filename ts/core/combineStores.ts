import Store from "../types/Store.js";
import Subscriber from "../types/Subscriber.js";
import Unsubscriber from "../types/Unsubscriber.js";

export default
function combineStores<T extends Array<any>>(stores: Array<Store<any>>): Store<T>
{
	const subscribers: Subscriber<T>[] = [];
	const store = function (): T {
		return stores.map(store => store()) as T;
	};

	const removeSubscriber = function (subscriber: Subscriber<T>)
	{
		const index = subscribers.indexOf(subscriber);
		if (index !== -1) {
			subscribers.splice(index, 1);
		}
	};

	const subscribe = function(fn: Subscriber<T>): Unsubscriber {
		subscribers.push(fn);
		return () => removeSubscriber(fn);
	};
	store.subscribe = subscribe;
	Object.defineProperty(store, 'subscribe', { value: subscribe });

	stores.forEach((store, index) => {
		store.subscribe((value) => {
			const valueToEmit = stores.map((store, index2) => index === index2 ? value : store());
			subscribers.forEach((subscriber) => {
				subscriber(valueToEmit as T);
			})
		});
	});

	store._members = stores;
	Object.defineProperty(store, '_members', { value: store._members });

	return store;
}
