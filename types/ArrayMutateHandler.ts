import type Store from "./Store";

type ArrayMutateHandler<MutationArgs extends unknown[]> = <T>(
	array: T[],
	index$Array: Store<number>[],
	...mutationArgs: MutationArgs
) => unknown[];

export { type ArrayMutateHandler as default };
