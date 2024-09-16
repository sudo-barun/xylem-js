import cumulate from "../core/cumulate.js";
import getValue from "../utilities/getValue.js";
function isInteger(value) {
    return (value ^ 0) === value;
}
const handleMove = function (array, index$Array, fromIndex, toIndex) {
    const fromIndex_ = getValue(fromIndex);
    const toIndex_ = getValue(toIndex);
    if (!isInteger(fromIndex_)) {
        throw new Error('"fromIndex" must be integer.');
    }
    if (!isInteger(toIndex_)) {
        throw new Error('"toIndex" must be integer.');
    }
    if (!(array.hasOwnProperty(fromIndex_))) {
        throw new Error(`"fromIndex" ${fromIndex_} is not valid index of the array in ArrayStore. Length of array is ${array.length}.`);
    }
    if (!(array.hasOwnProperty(toIndex_))) {
        throw new Error(`"toIndex" ${toIndex_} is not valid index of the array in ArrayStore. Length of array is ${array.length}.`);
    }
    const fromIndex$ = index$Array[fromIndex_];
    if (fromIndex_ < toIndex_) {
        for (const index$ of index$Array.slice(fromIndex_ + 1, toIndex_ + 1)) {
            cumulate(index$, (v) => v - 1);
        }
    }
    else if (fromIndex_ > toIndex_) {
        for (const index$ of index$Array.slice(toIndex_, fromIndex_)) {
            cumulate(index$, (v) => v + 1);
        }
    }
    fromIndex$._(toIndex_);
    const removedIndex = index$Array.splice(fromIndex_, 1)[0];
    index$Array.splice(toIndex_, 0, removedIndex);
    const removedItem = array.splice(fromIndex_, 1)[0];
    array.splice(toIndex_, 0, removedItem);
    return [fromIndex_, toIndex_];
};
export default handleMove;
