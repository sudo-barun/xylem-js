let lastKey = 0;

export
function generateContextKey(key: string|number = ''): string
{
	lastKey += 1;
	return '#' + key + lastKey;
}

export
function createContext<T extends object>(parentContext: T|null, contextData: T): T
{
	const context = {...contextData};
	Object.setPrototypeOf(context, parentContext);
	Object.freeze(context);
	return context;
}
