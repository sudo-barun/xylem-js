import type Emitter from "../types/Emitter.js";
import type Supplier from "../types/Supplier.js";

export default
function handleRemoveInArrayNormalization<T,U>(
	_createStoreForItem: ((item: T) => Supplier<U>) = ((item: T) => item as Supplier<U>),
	_emit: Emitter<U[]>,
	itemStores: Supplier<U>[],
	index : number
): void
{
	itemStores.splice(index, 1);
}
