import ArrayMutateAction from "./ArrayMutateAction";
import Store from "./Store";

type ArrayMutation<T> = {
	value: T[],
	action: ArrayMutateAction,
	item?: T,
	index$?: Store<number>,
};

export default ArrayMutation;
