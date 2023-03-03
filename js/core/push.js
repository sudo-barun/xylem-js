import createStore from "./createStore.js";
const push = function (array, index$Array, item) {
    index$Array.push(createStore(array.length));
    array.push(item);
    return [item];
};
export default push;
