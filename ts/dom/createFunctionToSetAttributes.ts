import setAttribute from "../dom/setAttribute.js"
import Attribute from "../types/Attribute.js";
import Store from "../types/Store.js";

export default
function (attributeNameToVarMap: { [key:string]: Store<string> })
{
	return function (element: Element)
	{
		for (const attributeName in attributeNameToVarMap) {
			const fn = attributeNameToVarMap[attributeName];
			setAttribute(element, attributeName, fn());
			const unsubscribe = fn.subscribe((value: Attribute) => {
				setAttribute(element, attributeName, value);
			});

			return function () {
				unsubscribe();
			};
		}
	}
}
