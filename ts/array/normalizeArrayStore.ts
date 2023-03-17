import ArrayMutation from "../types/ArrayMutation.js";
import ArraySupplier from "../types/ArraySupplier.js";
import Supplier from "../types/Supplier.js";
import arrayStoreMutation from "./arrayStoreMutation.js";
import createSupplier from "../core/createSupplier.js";
import createEmittableStream from "../core/createEmittableStream.js";
import Getter from "../types/Getter.js";
import Subscriber from "../types/Subscriber.js";
import SubscriberObject from "../types/SubscriberObject.js";
import EmittableStream from "../types/EmittableStream.js";

class NormalizedData<T> implements Getter<T[]>
{
	declare _itemStores: Supplier<T>[];

	_(): T[]
	{
		return this._itemStores.map((store) => store._());
	}
}

class ItemStoreSubscriber<T> implements SubscriberObject<T>
{
	declare _normalizedData: NormalizedData<T>;
	declare _stream: EmittableStream<T[]>;

	constructor(normalizedData: NormalizedData<T>, stream: EmittableStream<T[]>)
	{
		this._normalizedData = normalizedData;
		this._stream = stream;
	}

	_(value: T): void
	{
		// TODO: use emitted value
		this._stream._(this._normalizedData._());
	}
}

export default
function normalizeArrayStore<T,U>(
	arrayStore: ArraySupplier<T>,
	createStoreForItem: (item: T) => Supplier<U>
): Supplier<U[]>
{
	const normalizedData = new NormalizedData<U>();
	const stream = createEmittableStream<U[]>();

	const initItemStores = (value: T[]) => {
		normalizedData._itemStores = value.map(createStoreForItem);
		normalizedData._itemStores.forEach((store) => {
			store.subscribe(new ItemStoreSubscriber(normalizedData, stream));
		});
	};

	initItemStores(arrayStore._());

	arrayStore.subscribe((value) => {
		initItemStores(value);
		stream._(normalizedData._());
	});

	arrayStore.mutation.subscribe(([ value, action, ...mutationArgs ]: ArrayMutation<T>) => {
		const handler = arrayStoreMutation.getHandler(action);
		if (handler === null) {
			console.error('Array was mutated with action but no handler found for the action.', action);
			throw new Error('Array was mutated with action but no handler found for the action.');
		}
		handler(
			createStoreForItem,
			stream,
			normalizedData._itemStores,
			...mutationArgs
		);

		stream._(normalizedData._());
	});

	return createSupplier(normalizedData, stream);
}
