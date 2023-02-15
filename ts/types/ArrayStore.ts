import ArrayMutate from "./ArrayMutate";
import Store from "./Store";

type ArrayStore<T> = (
	Store<Array<T>>
	&
	{
		mutate: ArrayMutate<T>,
		index$Array: Array<Store<number>>,
		length$: Store<number>,
	}
);

export default ArrayStore;
