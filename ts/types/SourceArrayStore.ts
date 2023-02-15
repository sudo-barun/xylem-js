import ArrayMutate from "./ArrayMutate";
import SourceStore from "./SourceStore";
import Store from "./Store";

type SourceArrayStore<T> = (
	SourceStore<Array<T>>
	&
	{
		mutate: ArrayMutate<T>,
		index$Array: Array<Store<number>>,
		length$: Store<number>,
	}
);

export default SourceArrayStore;
