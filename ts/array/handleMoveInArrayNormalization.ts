import Emitter from "../types/Emitter.js";
import Supplier from "../types/Supplier.js";
import getValue from "../utilities/getValue.js";

export default
function handleMoveInArrayNormalization<T,U>(
	createStoreForItem: ((item: T) => Supplier<U>) = ((item: T) => item as Supplier<U>),
	emit: Emitter<U[]>,
	itemStores: Supplier<U>[],
	fromIndex: number|Supplier<number>,
	toIndex: number|Supplier<number>
): void
{
	const fromIndex_ = getValue(fromIndex);
	const toIndex_ = getValue(toIndex);

	const removedItemStore = itemStores.splice(fromIndex_, 1)[0];
	itemStores.splice(toIndex_, 0, removedItemStore);
}
