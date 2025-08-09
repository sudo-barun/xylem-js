import type ArrayMutate from "./_internal/ArrayMutate";
import type ArrayMutation from "./ArrayMutation";
import type Supplier from "./Supplier";
import type EmittableStream from "./EmittableStream";

type ArraySupplier<T> = (
	Supplier<Array<T>>
	&
	{
		mutate: ArrayMutate,
		mutation: EmittableStream<ArrayMutation<T>>,
		index$Array: Array<Supplier<number>>,
		length$: Supplier<number>,
	}
);

export { type ArraySupplier as default };
