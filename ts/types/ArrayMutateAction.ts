import SourceStore from "./SourceStore";

type ArrayMutateAction<MutationArgs extends any[] = any[]> = <T>(
	array: T[],
	index$Array: SourceStore<number>[],
	...mutationArgs: MutationArgs
) => any;

export default ArrayMutateAction;
