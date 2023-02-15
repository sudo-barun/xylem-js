import ArrayMutateAction from "../types/ArrayMutateAction.js";
import SourceStore from "../types/SourceStore.js";
import createStore from "./createStore.js";

const push: ArrayMutateAction = function <T>(
	array: T[],
	index$Array: SourceStore<number>[],
	item: T
): number
{
	index$Array.push(createStore(array.length));
	return array.push(item);
}

export default push;
