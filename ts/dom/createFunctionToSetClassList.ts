import Getter from "../types/Getter.js";
import Store from "../types/Store.js";

export
function setClass(element: Element, class_: string, value: boolean)
{
	if (value) {
		element.classList.add(class_);
	} else {
		element.classList.remove(class_);
	}
}

export default
function (classFnMap: {[key:string]: boolean|Getter<boolean>|Store<boolean>})
{
	return function (element: Element)
	{
		for (const class_ in classFnMap) {
			const fn = classFnMap[class_];
			setClass(element, class_, typeof fn === 'function' ? fn(): fn);

			if ((typeof fn === 'function') && ('subscribe' in fn)) {
				fn.subscribe(function (value) {
					setClass(element, class_, value);
				});
			}
			// TODO: unsubscribe
		}
	}
}
