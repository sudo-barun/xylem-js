import ArrayMutateAction from "../types/ArrayMutateAction.js";
import SourceStore from "../types/SourceStore.js";
import createStore from "./createStore.js";

const push: ArrayMutateAction<[any]> = function <T>(
	array: T[],
	index$Array: SourceStore<number>[],
	item: T
): [T]
{
	index$Array.push(createStore(array.length));
	array.push(item);

	return [item];
}

export default push;
