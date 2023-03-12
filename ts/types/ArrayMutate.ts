import ArrayMutateAction from "./ArrayMutateAction";

type ArrayMutate<T> = (
	(
		<MutationArgs extends any[]>(action: ArrayMutateAction<any[]>, ...otherArgs: MutationArgs) => void
	)
);

export default ArrayMutate;
