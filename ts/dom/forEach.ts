import ArrayDataNode from "../types/ArrayDataNode.js";
import ForEachBlockBuilder from "./_internal/ForEachBlockBuilder.js";
import ForEachItemBuilder from "../types/_internal/ForEachItemBuilder.js";
import DataNode from "../types/DataNode.js";

export default
function forEach<T>(array: T[]|DataNode<T[]>|ArrayDataNode<T>, build: ForEachItemBuilder<T>)
{
	return new ForEachBlockBuilder(array, build);
}
