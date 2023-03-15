type FunctionOrCallableObject<Args extends Array<any>, Return> = (
	((...args: Args) => Return)
	|
	{
		_: (...args: Args) => Return,
	}
);

export default FunctionOrCallableObject;
