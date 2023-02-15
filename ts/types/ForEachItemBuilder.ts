import ArrayStore from "./ArrayStore";
import ComponentItem from "./ComponentItem";
import ForEachBlock from "../dom/ForEachBlock";
import Store from "./Store";

type ForEachItemBuilder<T> = (
	this: ForEachBlock<T>,
	item: T,
	index: Store<number>,
	array: T[]|Store<T[]>|ArrayStore<T>
) => Array<ComponentItem>; 

export default ForEachItemBuilder;
