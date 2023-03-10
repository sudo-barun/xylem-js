import ArrayMutateAction from "../types/ArrayMutateAction.js";
import Store from "../types/Store.js";
import createStore from "../core/createStore.js";

const push: ArrayMutateAction<[any]> = function <T>(
	array: T[],
	index$Array: Store<number>[],
	item: T
): [T]
{
	index$Array.push(createStore(array.length));
	array.push(item);

	return [item];
}

export default push;
