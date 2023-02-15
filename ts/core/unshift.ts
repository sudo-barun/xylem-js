import ArrayMutateAction from "../types/ArrayMutateAction.js";
import SourceStore from "../types/SourceStore.js";
import createStore from "./createStore.js";

const unshift: ArrayMutateAction = function <T>(
	array: T[],
	index$Array: SourceStore<number>[],
	item: T
): number {
	index$Array.unshift(createStore(0));
	for (let i = 1; i < index$Array.length; i++) {
		index$Array[i](index$Array[i]()+1);
	}
	return array.unshift(item);
}

export default unshift;
