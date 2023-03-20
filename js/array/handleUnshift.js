import createStore from "../core/createStore.js";
const handleUnshift = function (array, index$Array, item) {
    index$Array.unshift(createStore(0));
    for (let i = 1; i < index$Array.length; i++) {
        index$Array[i]._(index$Array[i]._() + 1);
    }
    array.unshift(item);
    return [item];
};
export default handleUnshift;
