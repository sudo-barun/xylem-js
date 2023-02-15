const splice = function (array, index$Array, _, index$) {
    const index = index$();
    for (let i = index + 1; i < index$Array.length; i++) {
        index$Array[i](index$Array[i]() - 1);
    }
    index$Array.splice(index, 1);
    return array.splice(index, 1);
};
export default splice;
