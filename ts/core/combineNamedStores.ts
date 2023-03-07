import Store from "../types/Store.js";
import Subscriber from "../types/Subscriber.js";
import Unsubscriber from "../types/Unsubscriber.js";

export default
function combineNamedStores<T extends {[prop: string]: any}>(stores: {[prop: string]: Store<any>}): Store<T>
{
	const subscribers: Subscriber<T>[] = [];
	const store = function (): T {
		return Object.keys(stores).reduce(function (acc, key) {
			acc[key] = stores[key]();
			return acc;
		}, {} as {[prop: string]:any}) as T;
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
		return function () {
			removeSubscriber(fn);
		};
	};
	store.subscribe = subscribe;
	Object.defineProperty(store, 'subscribe', { value: subscribe });

	Object.keys(stores).forEach((index) => {
		stores[index].subscribe((value) => {
			const valueToEmit = Object.keys(stores).reduce(function (acc, index2) {
				acc[index2] = index === index2 ? value : stores[index2]();
				return acc;
			}, {} as {[prop: string]:any});
			subscribers.forEach((subscriber) => {
				subscriber(valueToEmit as T);
			})
		});
	});

	store._members = stores;
	Object.defineProperty(store, '_members', { value: store._members });

	return store;
}
