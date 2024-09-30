import ArrayMutateHandler from "../types/ArrayMutateHandler.js";
import Store from "../types/Store.js";
import createStore from "../core/createStore.js";

const handlePush: ArrayMutateHandler<[unknown]> = function <T>(
	array: T[],
	index$Array: Store<number>[],
	item: T
): [T]
{
	index$Array.push(createStore(array.length));
	array.push(item);

	return [item];
}

export default handlePush;
