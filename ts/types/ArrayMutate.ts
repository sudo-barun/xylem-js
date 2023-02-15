import ArrayMutateAction from "./ArrayMutateAction";
import ArrayMutationSubscriber from "./ArrayMutationSubscriber";
import Store from "./Store";
import Unsubscriber from "./Unsubscriber";

type ArrayMutate<T> = (
	(
		(action: ArrayMutateAction, item?: T, index$?: Store<number>) => any
	)
	&
	{
		subscribe: (subscriber: ArrayMutationSubscriber<T>) => Unsubscriber,
	}
);

export default ArrayMutate;
