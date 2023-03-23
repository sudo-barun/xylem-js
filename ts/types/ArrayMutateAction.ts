import ArrayMutateHandler from "./ArrayMutateHandler";

type ArrayMutateAction<MutationArgs extends any[]> = {
	_: ArrayMutateHandler<MutationArgs>,
	[key: string]: any,
};

export default ArrayMutateAction;
