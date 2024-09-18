import ArrayMutateHandler from "../types/ArrayMutateHandler.js";
import Supplier from "../types/Supplier.js";
import getValue from "../utilities/getValue.js";
import Store from "../types/Store.js";

function isInteger(value: number): boolean
{
	return (value ^ 0) === value;
}

const handleRemove: ArrayMutateHandler<[number|Supplier<number>]> = function <T>(
	array: T[],
	index$Array: Store<number>[],
	index: number|Supplier<number>,
)
{
	const index_ = getValue(index);

	if (! isInteger(index_)) {
		throw new Error('"index" must be integer.');
	}

	if (! (array.hasOwnProperty(index_))) {
		throw new Error(`"index" ${index_} is not valid index of the array in ArrayStore. Length of array is ${array.length}.`);
	}

	for (let i = index_+1; i < index$Array.length; i++) {
		index$Array[i]._(index$Array[i]._()-1);
	}
	index$Array.splice(index_, 1);

	array.splice(index_, 1);

	return [index_];
}

export default handleRemove;
