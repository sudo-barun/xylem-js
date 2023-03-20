import Emitter from "../types/Emitter.js";
import Supplier from "../types/Supplier.js";

export default
function handleUnshiftInArrayNormalization<T,U>(
	createStoreForItem: ((item: T) => Supplier<U>) = ((item: T) => item as Supplier<U>),
	emit: Emitter<U[]>,
	itemStores: Supplier<U>[],
	item: T
): void
{
	const getter = () => itemStores.map((store) => store._());
	const store = createStoreForItem(item);
	store.subscribe((value) => {
		// TODO: use emitted value
		emit._(getter());
	});
	itemStores.unshift(store);
}

