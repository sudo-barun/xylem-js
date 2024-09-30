import Emitter from "../types/Emitter.js";
import Supplier from "../types/Supplier.js";

export default
function handleRemoveInArrayNormalization<T,U>(
	createStoreForItem: ((item: T) => Supplier<U>) = ((item: T) => item as Supplier<U>),
	emit: Emitter<U[]>,
	itemStores: Supplier<U>[],
	index : number
): void
{
	itemStores.splice(index, 1);
}
