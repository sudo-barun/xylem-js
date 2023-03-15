import ArrayDataNode from "../types/ArrayDataNode.js";
import ForEachBlockBuilder from "./_internal/ForEachBlockBuilder.js";
import ForEachBuild from "../types/_internal/ForEachBuild.js";
import DataNode from "../types/DataNode.js";

export default
function forEach<T>(array: T[]|DataNode<T[]>|ArrayDataNode<T>, build: ForEachBuild<T>)
{
	return new ForEachBlockBuilder(array, build);
}
