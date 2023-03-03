import ArrayMutateAction from "./ArrayMutateAction";

type ArrayMutation<T, MutationArgs extends any[] = any[]> = [
	value: T[],
	action: ArrayMutateAction<MutationArgs>,
	...mutationArgs: MutationArgs,
];

export default ArrayMutation;
