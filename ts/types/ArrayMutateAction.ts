import Store from "./Store";

type ArrayMutateAction<MutationArgs extends any[] = any[]> = <T>(
	array: T[],
	index$Array: Store<number>[],
	...mutationArgs: MutationArgs
) => any;

export default ArrayMutateAction;
