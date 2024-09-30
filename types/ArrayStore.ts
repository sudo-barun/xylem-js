import ArrayMutate from "./_internal/ArrayMutate";
import ArrayMutation from "./ArrayMutation";
import Supplier from "./Supplier";
import EmittableStream from "./EmittableStream";
import Store from "./Store";

type ArrayStore<T> = (
	Store<Array<T>>
	&
	{
		mutate: ArrayMutate,
		mutation: EmittableStream<ArrayMutation<T>>,
		index$Array: Array<Supplier<number>>,
		length$: Supplier<number>,
	}
);

export default ArrayStore;
