import type ArrayMutate from "./_internal/ArrayMutate";
import type ArrayMutation from "./ArrayMutation";
import type Supplier from "./Supplier";
import type EmittableStream from "./EmittableStream";
import type Store from "./Store";

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

export { type ArrayStore as default };
