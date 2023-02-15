import createProxyStore from "../core/createProxyStore.js";
import createStream from "../core/createStream.js";
import Store from "../types/Store.js";

type StyleDefinitions = {
	[property: string]: any|Store<any>,
};

function styleToString(styleDefinitions: StyleDefinitions): string
{
	return Object.keys(styleDefinitions).reduce((acc, property) => {
		const definition = styleDefinitions[property];
		let value = definition instanceof Function ? (definition as Store<any>)() : definition;
		acc.push(`${property}:${value}`);
		return acc;
	}, [] as string[]).join(';');
}

export default
function styleAttr(styleDefinitions: StyleDefinitions): Store<string>
{
	const getter = () => styleToString(styleDefinitions);
	const stream = createStream<string>();
	Object.keys(styleDefinitions).forEach(property => {
		const definition = styleDefinitions[property];
		if ((definition instanceof Function) && ('subscribe' in definition)) {
			(definition as Store<any>).subscribe((value) => {
				stream(styleToString(styleDefinitions));
			});
		}
	});
	return createProxyStore<string>(getter, stream);
}
