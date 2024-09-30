import ArrayMutateAction from "./ArrayMutateAction";

type ArrayMutation<T, MutationArgs extends unknown[] = unknown[]> = [
	value: T[],
	action: ArrayMutateAction<MutationArgs>,
	...mutationArgs: MutationArgs,
];

export default ArrayMutation;
