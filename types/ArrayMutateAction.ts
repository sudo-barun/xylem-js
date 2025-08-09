import type ArrayMutateHandler from "./ArrayMutateHandler";

type ArrayMutateAction<MutationArgs extends unknown[]> = {
	_: ArrayMutateHandler<MutationArgs>,
	[key: string]: unknown,
};

export { type ArrayMutateAction as default };
