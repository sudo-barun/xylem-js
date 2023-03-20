import ArrayMutateHandler from "./ArrayMutateHandler";

type ArrayMutateAction<MutationArgs extends any[] = any[]> = {
	_: ArrayMutateHandler<MutationArgs>,
	[key: string]: any,
};

export default ArrayMutateAction;
