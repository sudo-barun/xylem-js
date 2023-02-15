import ArrayMutate from "../types/ArrayMutate.js";
import ArrayMutateAction from "../types/ArrayMutateAction.js";
import ArrayMutationSubscriber from "../types/ArrayMutationSubscriber.js";
import SourceArrayStore from "../types/SourceArrayStore.js";
import Store from "../types/Store.js";
import Subscriber from "../types/Subscriber.js";
import createProxyStore from "./createProxyStore.js";
import createStore from "./createStore.js";
import createStream from "./createStream.js";

export default
function createArrayStore<T> (value: Array<T>): SourceArrayStore<T>
{
	if (! (value instanceof Array)) {
		throw new Error('Value must be an array.');
	}
	const subscribers: Subscriber<Array<T>>[] = [];
	const mutationSubscribers: ArrayMutationSubscriber<T>[] = [];
	const state = {
		value,
		subscribers,
		mutationSubscribers,
	};

	const arrayStore = function (newValue?: Array<T>): Array<T>
	{
		if (arguments.length === 0) {
			return state.value;
		} else {
			state.value = newValue!;
			subscribers.forEach(subscriber => subscriber(state.value));
			return state.value;
		}
	};

	const removeSubscriber = function (subscriber: Subscriber<Array<T>>)
	{
		const index = subscribers.indexOf(subscriber);
		if (index !== -1) {
			subscribers.splice(index, 1);
		}
	};

	const subscribe = function (subscriber: Subscriber<Array<T>>)
	{
		subscribers.push(subscriber);
		return function () {
			removeSubscriber(subscriber);
		};
	};
	arrayStore.subscribe = subscribe;
	Object.defineProperty(arrayStore, 'subscribe', { value: subscribe });

	const readonly = function ()
	{
		if (arguments.length > 0) {
			throw new Error(`Setting value is not allowed`);
		}
		return arrayStore();
	};
	readonly.subscribe = subscribe;

	arrayStore.readonly = readonly;
	Object.defineProperty(arrayStore, 'readonly', { value: readonly });

	const mutate: ArrayMutate<T> = function (action: ArrayMutateAction, item?: T, index$?: Store<number>) {
		action<T>(state.value, arrayStore.index$Array, item, index$);
		state.mutationSubscribers.forEach(subscriber => subscriber({
			value: state.value,
			action,
			item,
			index$,
		}));
	};

	const unsubscribeMutation = function (subscriber: ArrayMutationSubscriber<T>)
	{
		const index = mutationSubscribers.indexOf(subscriber);
		if (index === -1) {
			throw new Error('Subscriber already removed from the list of subscribers');
		}
		mutationSubscribers.splice(index, 1);
	};

	const subscribeMutation = (subscriber: ArrayMutationSubscriber<T>) => {
		state.mutationSubscribers.push(subscriber);
		return function () {
			unsubscribeMutation(subscriber);
		};
	};

	mutate.subscribe = subscribeMutation;
	Object.defineProperty(mutate, 'subscribe', { value: mutate.subscribe });
	arrayStore.mutate = mutate;
	Object.defineProperty(arrayStore, 'mutate', { value: arrayStore.mutate });

	Object.defineProperty(arrayStore, '_state', { value: state });
	Object.defineProperty(readonly, '_state', { value: state });

	const lengthGetter = () => state.value.length;
	const lengthStream = createStream<number>();

	subscribe((value) => arrayStore.index$Array = value.map((_, index) => createStore(index)));
	subscribe((value) => lengthStream(value.length));
	mutate.subscribe(({value}) => lengthStream(value.length));

	const length$ = createProxyStore(lengthGetter, lengthStream);

	arrayStore.length$ = length$;
	arrayStore.index$Array = value.map((_, index) => createStore(index));

	return arrayStore;
}
