import ArrayDataNode from "../../types/ArrayDataNode.js";
import ForEachBlock from "./ForEachBlock.js";
import ForEachBuild from "../../types/_internal/ForEachBuild.js";
import DataNode from "../../types/DataNode.js";

export default
class ForEachBlockBuilder<T>
{
	declare _array: T[]|DataNode<T[]>|ArrayDataNode<T>;
	declare _build: ForEachBuild<T>;

	constructor(array: T[]|DataNode<T[]>|ArrayDataNode<T>, build: ForEachBuild<T>)
	{
		this._array = array;
		this._build = build;
	}

	endForEach(): ForEachBlock<T>
	{
		return new ForEachBlock<T>({
			array: this._array,
			build: this._build
		});
	}
}
