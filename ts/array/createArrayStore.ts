import ArrayMutate from "../types/ArrayMutate.js";
import ArrayMutateAction from "../types/ArrayMutateAction.js";
import ArrayMutationSubscriber from "../types/ArrayMutationSubscriber.js";
import ArrayStore from "../types/ArrayStore.js";
import createEmittableStream from "../core/createEmittableStream.js";
import createDataNode from "../core/createDataNode.js";
import createStore from "../core/createStore.js";
import Subscriber from "../types/Subscriber.js";

export default
function createArrayStore<T> (value: Array<T>): ArrayStore<T>
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
			if (! (value instanceof Array)) {
				throw new Error('Value must be an array.');
			}
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

	const mutate: ArrayMutate<T> = function<MutationArgs extends any[]>(
		action: ArrayMutateAction<MutationArgs>,
		...otherArgs: MutationArgs
	) {
		// The mutation argument can change, for example index$ value can change.
		// So, initial value of arguments is returned from action and used.
		const otherArgs_ = action<T>(state.value, arrayStore.index$Array, ...otherArgs);
		state.mutationSubscribers.forEach(subscriber => subscriber([
			state.value,
			action as unknown as ArrayMutateAction<any[]>,
			...otherArgs_
		]));
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
	const lengthStream = createEmittableStream<number>();

	subscribe((value) => arrayStore.index$Array = value.map((_, index) => createStore(index)));
	subscribe((value) => lengthStream(value.length));
	mutate.subscribe(([value]) => lengthStream(value.length));

	const length$ = createDataNode(lengthGetter, lengthStream);

	arrayStore.length$ = length$;
	arrayStore.index$Array = value.map((_, index) => createStore(index));

	return arrayStore;
}
