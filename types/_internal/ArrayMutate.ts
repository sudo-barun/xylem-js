import ArrayMutateAction from "../ArrayMutateAction";

type ArrayMutate = <MutationArgs extends unknown[]>(
	action: ArrayMutateAction<MutationArgs>,
	...otherArgs: MutationArgs
) => void;

export default ArrayMutate;
