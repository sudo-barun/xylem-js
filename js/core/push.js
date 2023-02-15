import createStore from "./createStore.js";
const push = function (array, index$Array, item) {
    index$Array.push(createStore(array.length));
    return array.push(item);
};
export default push;
