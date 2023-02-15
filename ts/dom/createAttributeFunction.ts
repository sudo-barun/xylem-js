import Attribute from "../types/Attribute.js";
import Getter from "../types/Getter.js";
import setAttribute from "../dom/setAttribute.js";
import Store from "../types/Store.js";
import Unsubscriber from "../types/Unsubscriber.js";

export default
function createAttributeFunction(fn: Store<Attribute>|Getter<Attribute>)
{
	return function (
		element: Element,
		attributeName: string,
	): Unsubscriber|void {
		setAttribute(element, attributeName, fn());
		if ('subscribe' in fn) {
			const unsubscribe = fn.subscribe(function (value: Attribute) {
				setAttribute(element, attributeName, value);
			});

			return function () {
				unsubscribe();
			};
		}
	};
}
