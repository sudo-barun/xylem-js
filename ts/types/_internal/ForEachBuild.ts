import ComponentChildren from "../ComponentChildren";
import DataNode from "../DataNode";
import ForEachBlockItem from "../../dom/_internal/ForEachBlockItem";
import FunctionOrCallableObject from "../FunctionOrCallableObject";

type ForEachBuild<T> = FunctionOrCallableObject<[
	item: T,
	index: DataNode<number>,
	component: ForEachBlockItem<T>,
], ComponentChildren>;

export default ForEachBuild;
