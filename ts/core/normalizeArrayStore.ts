import ArrayMutation from "../types/ArrayMutation.js";
import ArrayStore from "../types/ArrayStore.js";
import Store from "../types/Store.js";
import arrayStoreMutation from "./arrayStoreMutation.js";
import createProxyStore from "./createProxyStore.js";
import createStream from "./createStream.js";

export default
function normalizeArrayStore<T,U>(
	arrayStore: ArrayStore<T>,
	createStoreForItem: (item: T) => Store<U>
): Store<U[]>
{
	const getter = () => itemStores.map((store) => store());
	const stream = createStream<U[]>();

	let itemStores: Store<U>[];

	const initItemStores = (value: T[]) => {
		itemStores = value.map(createStoreForItem);
		itemStores.forEach((store) => {
			store.subscribe((value) => {
				// TODO: use emitted value
				stream(getter());
			});
		});
	};

	initItemStores(arrayStore());

	arrayStore.subscribe((value) => {
		initItemStores(value);
		stream(getter());
	});

	arrayStore.mutate.subscribe(([ value, action, mutationArgs ]: ArrayMutation<T>) => {
		const handler = arrayStoreMutation.getHandler(action);
		if (handler === null) {
			console.error('Array was mutated with action but no handler found for the action.', action);
			throw new Error('Array was mutated with action but no handler found for the action.');
		}
		handler(
			createStoreForItem,
			stream,
			itemStores,
			mutationArgs
		);

		stream(getter());
	});

	return createProxyStore(getter, stream);
}
