import getValue from "../utilities/getValue.js";
function isInteger(value) {
    return (value ^ 0) === value;
}
const handleRemove = function (array, index$Array, index) {
    const index_ = getValue(index);
    if (!isInteger(index_)) {
        throw new Error('"index" must be integer.');
    }
    if (!(array.hasOwnProperty(index_))) {
        throw new Error(`"index" ${index_} is not valid index of the array in ArrayStore. Length of array is ${array.length}.`);
    }
    for (let i = index_ + 1; i < index$Array.length; i++) {
        index$Array[i]._(index$Array[i]._() - 1);
    }
    index$Array.splice(index_, 1);
    array.splice(index_, 1);
    return [index_];
};
export default handleRemove;
