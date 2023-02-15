import setAttribute from "../dom/setAttribute.js";
export default function createAttributeFunction(fn) {
    return function (element, attributeName) {
        setAttribute(element, attributeName, fn());
        if ('subscribe' in fn) {
            const unsubscribe = fn.subscribe(function (value) {
                setAttribute(element, attributeName, value);
            });
            return function () {
                unsubscribe();
            };
        }
    };
}
