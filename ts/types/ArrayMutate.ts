import ArrayMutateAction from "./ArrayMutateAction";
import ArrayMutationSubscriber from "./ArrayMutationSubscriber";
import Unsubscriber from "./Unsubscriber";

type ArrayMutate<T> = (
	(
		<MutationArgs extends any[]>(action: ArrayMutateAction<any[]>, ...otherArgs: MutationArgs) => void
	)
	&
	{
		subscribe: (subscriber: ArrayMutationSubscriber<T>) => Unsubscriber,
	}
);

export default ArrayMutate;
