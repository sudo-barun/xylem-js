import Emitter from "../types/Emitter.js";
import Store from "../types/Store.js";

export default
function handleSplice<T,U>(
	createStoreForItem: ((item: T) => Store<U>) = ((item: T) => item as Store<U>),
	emit: Emitter<U[]>,
	itemStores: Store<U>[],
	index : number
): void
{
	itemStores.splice(index, 1);
}
