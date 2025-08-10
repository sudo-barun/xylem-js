type FunctionOrCallableObject<This, Args extends Array<unknown>, Return> = (
	((this: This, ...args: Args) => Return)
	|
	{
		_: (...args: Args) => Return,
	}
);

export { type FunctionOrCallableObject as default };
