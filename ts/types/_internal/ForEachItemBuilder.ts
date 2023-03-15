import ComponentChildren from "../ComponentChildren";
import DataNode from "../DataNode";
import ForEachBlockItem from "../../dom/_internal/ForEachBlockItem";

type ForEachItemBuilder<T> = (
	item: T,
	index: DataNode<number>,
	component: ForEachBlockItem<T>,
) => ComponentChildren;

export default ForEachItemBuilder;
