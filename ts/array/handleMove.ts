import Emitter from "../types/Emitter.js";
import DataNode from "../types/DataNode.js";
import getValue from "../utilities/getValue.js";

export default
function handleMove<T,U>(
	createStoreForItem: ((item: T) => DataNode<U>) = ((item: T) => item as DataNode<U>),
	emit: Emitter<U[]>,
	itemStores: DataNode<U>[],
	fromIndex: number|DataNode<number>,
	toIndex: number|DataNode<number>
): void
{
	const fromIndex_ = getValue(fromIndex);
	const toIndex_ = getValue(toIndex);

	const removedItemStore = itemStores.splice(fromIndex_, 1)[0];
	itemStores.splice(toIndex_, 0, removedItemStore);
}
