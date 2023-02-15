import Store from "../types/Store.js";
import Subscriber from "../types/Subscriber.js";
import Unsubscriber from "../types/Unsubscriber.js";

type ObjectStore<T extends object> = Store<T> & { members: {[prop: string]: Store<any>}}

export default
function deriveStoreFromObject<T extends object>(stores: {[prop: string]: Store<any>}): ObjectStore<T>
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

	store.members = stores;
	Object.defineProperty(store, 'members', { value: store.members });

	return store;
}
