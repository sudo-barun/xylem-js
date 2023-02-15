import Attribute from "../types/Attribute.js";

export default
function setAttribute(element: Element, name: string, value: Attribute)
{
	if (value === true) {
		element.setAttribute(name, '');
	} else if (([ undefined, null, false ] as any[]).includes(value)) {
		element.removeAttribute(name);
	} else {
		element.setAttribute(name, <string> value);
	}
}
