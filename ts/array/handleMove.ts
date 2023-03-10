import Emitter from "../types/Emitter.js";
import DataNode from "../types/DataNode.js";

export default
function handleMove<T,U>(
	createStoreForItem: ((item: T) => DataNode<U>) = ((item: T) => item as DataNode<U>),
	emit: Emitter<U[]>,
	itemStores: DataNode<U>[],
	fromIndex: number|DataNode<number>,
	toIndex: number|DataNode<number>
): void
{
	const fromIndex_ = typeof fromIndex === 'function' ? fromIndex() : fromIndex;
	const toIndex_ = typeof toIndex === 'function' ? toIndex() : toIndex;

	const removedItemStore = itemStores.splice(fromIndex_, 1)[0];
	itemStores.splice(toIndex_, 0, removedItemStore);
}
