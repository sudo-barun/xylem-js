type FunctionOrCallableObject<Args extends Array<unknown>, Return> = (
	((...args: Args) => Return)
	|
	{
		_: (...args: Args) => Return,
	}
);

export default FunctionOrCallableObject;
