import createStore from "../core/createStore.js";
const handlePush = function (array, index$Array, item) {
    index$Array.push(createStore(array.length));
    array.push(item);
    return [item];
};
export default handlePush;
