import ArrayMutate from "./ArrayMutate";
import ArrayMutation from "./ArrayMutation";
import DataNode from "./DataNode";
import EmittableStream from "./EmittableStream";
import Store from "./Store";

type ArrayStore<T> = (
	Store<Array<T>>
	&
	{
		mutate: ArrayMutate<T>,
		mutation: EmittableStream<ArrayMutation<T>>,
		index$Array: Array<DataNode<number>>,
		length$: DataNode<number>,
	}
);

export default ArrayStore;
