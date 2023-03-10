import ArrayMutateAction from "../types/ArrayMutateAction.js";
import Store from "../types/Store.js";
import createStore from "../core/createStore.js";

const unshift: ArrayMutateAction<[any]> = function <T>(
	array: T[],
	index$Array: Store<number>[],
	item: T
): [T]
{
	index$Array.unshift(createStore(0));
	for (let i = 1; i < index$Array.length; i++) {
		index$Array[i](index$Array[i]()+1);
	}
	array.unshift(item);

	return [item];
}

export default unshift;
