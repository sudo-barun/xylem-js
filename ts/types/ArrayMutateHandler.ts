import Store from "./Store";

type ArrayMutateHandler<MutationArgs extends any[]> = <T>(
	array: T[],
	index$Array: Store<number>[],
	...mutationArgs: MutationArgs
) => any;

export default ArrayMutateHandler;
