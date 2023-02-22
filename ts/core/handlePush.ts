import Emitter from "../types/Emitter.js";
import Store from "../types/Store.js";

export default
function handlePush<T,U>(
	createStoreForItem: ((item: T) => Store<U>) = ((item: T) => item as Store<U>),
	emit: Emitter<U[]>,
	itemStores: Store<U>[],
	{item} : {item: T}
): void
{
	const getter = () => itemStores.map((store) => store());
	const store = createStoreForItem(item);
	store.subscribe((value) => {
		// TODO: use emitted value
		emit(getter());
	});
	itemStores.push(store);
}
