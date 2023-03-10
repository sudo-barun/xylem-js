import ArrayMutate from "./ArrayMutate";
import DataNode from "./DataNode";
import Store from "./Store";

type ArrayStore<T> = (
	Store<Array<T>>
	&
	{
		mutate: ArrayMutate<T>,
		index$Array: Array<DataNode<number>>,
		length$: DataNode<number>,
	}
);

export default ArrayStore;
