import ArrayMutateAction from "../types/ArrayMutateAction.js";
import SourceStore from "../types/SourceStore.js";
import Store from "../types/Store.js";

const splice: ArrayMutateAction = function <T>(
	array: T[],
	index$Array: SourceStore<number>[],
	_?: T,
	index$?: Store<number>
): T[] {
	const index = index$!();
	for (let i = index+1; i < index$Array.length; i++) {
		index$Array[i](index$Array[i]()-1);
	}
	index$Array.splice(index, 1);
	return array.splice(index, 1);
}

export default splice;
