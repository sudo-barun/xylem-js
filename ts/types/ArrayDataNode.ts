import ArrayMutate from "./ArrayMutate";
import DataNode from "./DataNode";

type ArrayDataNode<T> = (
	DataNode<Array<T>>
	&
	{
		mutate: ArrayMutate<T>,
		index$Array: Array<DataNode<number>>,
		length$: DataNode<number>,
	}
);

export default ArrayDataNode;
