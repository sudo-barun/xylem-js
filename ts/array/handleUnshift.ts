import ArrayMutateHandler from "../types/ArrayMutateHandler.js";
import Store from "../types/Store.js";
import createStore from "../core/createStore.js";

const handleUnshift: ArrayMutateHandler<[unknown]> = function <T>(
	array: T[],
	index$Array: Store<number>[],
	item: T
): [T]
{
	index$Array.unshift(createStore(0));
	for (let i = 1; i < index$Array.length; i++) {
		index$Array[i]._(index$Array[i]._()+1);
	}
	array.unshift(item);

	return [item];
}

export default handleUnshift;
