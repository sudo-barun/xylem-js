import Emitter from "../types/Emitter.js";
import DataNode from "../types/DataNode.js";

export default
function handlePush<T,U>(
	createStoreForItem: ((item: T) => DataNode<U>) = ((item: T) => item as DataNode<U>),
	emit: Emitter<U[]>,
	itemStores: DataNode<U>[],
	item : T
): void
{
	const getter = () => itemStores.map((store) => store._());
	const store = createStoreForItem(item);
	store.subscribe((value) => {
		// TODO: use emitted value
		emit._(getter());
	});
	itemStores.push(store);
}
