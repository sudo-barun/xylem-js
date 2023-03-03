import Emitter from "../types/Emitter.js";
import Store from "../types/Store.js";

export default
function handleMove<T,U>(
	createStoreForItem: ((item: T) => Store<U>) = ((item: T) => item as Store<U>),
	emit: Emitter<U[]>,
	itemStores: Store<U>[],
	fromIndex: number|Store<number>,
	toIndex: number|Store<number>
): void
{
	const fromIndex_ = typeof fromIndex === 'function' ? fromIndex() : fromIndex;
	const toIndex_ = typeof toIndex === 'function' ? toIndex() : toIndex;

	const removedItemStore = itemStores.splice(fromIndex_, 1)[0];
	itemStores.splice(toIndex_, 0, removedItemStore);
}
