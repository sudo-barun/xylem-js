import setAttribute from "../dom/setAttribute.js";
export default function (attributeNameToVarMap) {
    return function (element) {
        for (const attributeName in attributeNameToVarMap) {
            const fn = attributeNameToVarMap[attributeName];
            setAttribute(element, attributeName, fn());
            const unsubscribe = fn.subscribe((value) => {
                setAttribute(element, attributeName, value);
            });
            return function () {
                unsubscribe();
            };
        }
    };
}
