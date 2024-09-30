import ArrayMutateHandler from "./ArrayMutateHandler";

type ArrayMutateAction<MutationArgs extends unknown[]> = {
	_: ArrayMutateHandler<MutationArgs>,
	[key: string]: unknown,
};

export default ArrayMutateAction;
