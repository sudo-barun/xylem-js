import ArrayDataNode from "../ArrayDataNode";
import ComponentChildren from "../ComponentChildren";
import ForEachBlock from "../../dom/_internal/ForEachBlock";
import DataNode from "../DataNode";

type ForEachItemBuilder<T> = (
	this: ForEachBlock<T>,
	item: T,
	index: DataNode<number>,
	array: T[]|DataNode<T[]>|ArrayDataNode<T>
) => ComponentChildren; 

export default ForEachItemBuilder;
