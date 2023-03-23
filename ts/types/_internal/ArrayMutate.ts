import ArrayMutateAction from "../ArrayMutateAction";

type ArrayMutate = <MutationArgs extends any[]>(
	action: ArrayMutateAction<MutationArgs>,
	...otherArgs: MutationArgs
) => void;

export default ArrayMutate;
