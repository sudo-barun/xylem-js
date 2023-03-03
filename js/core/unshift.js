import createStore from "./createStore.js";
const unshift = function (array, index$Array, item) {
    index$Array.unshift(createStore(0));
    for (let i = 1; i < index$Array.length; i++) {
        index$Array[i](index$Array[i]() + 1);
    }
    array.unshift(item);
    return [item];
};
export default unshift;
