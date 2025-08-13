let lastKey = 0;

export
function generateContextKey(key: string|number = ''): string
{
	lastKey += 1;
	return key + '__' + lastKey;
}

export
class Context<ContextData extends object>
{
	declare _data: ContextData;

	constructor(data: ContextData)
	{
		this._data = data;
	}

	getItem<T extends keyof ContextData>(key: T): ContextData[T];
	getItem<T extends keyof ContextData>(key: T, default_: ContextData[T]): ContextData[T];
	getItem<T extends keyof ContextData>(key: T, default_?: ContextData[T]): ContextData[T]
	{
		if (key in this._data) {
			return this._data[key];
		} else if (arguments.length > 1) {
			return default_!;
		} else {
			throw new Error('Context does not have key: ' + String(key) + ' and default value is not provided.');
		}
	}

	getAll(): ContextData
	{
		return this._data;
	}
}

export
function createContext<T extends object>(parentContext: Context<T>|null, contextData_: T): Context<T>
{
	const contextData = {...contextData_};
	Object.setPrototypeOf(contextData, parentContext ? parentContext.getAll() : null);
	Object.freeze(contextData);
	return new Context(contextData);
}
