import Emitter from "../types/Emitter.js";
import DataNode from "../types/DataNode.js";

export default
function handleRemove<T,U>(
	createStoreForItem: ((item: T) => DataNode<U>) = ((item: T) => item as DataNode<U>),
	emit: Emitter<U[]>,
	itemStores: DataNode<U>[],
	index : number
): void
{
	itemStores.splice(index, 1);
}
