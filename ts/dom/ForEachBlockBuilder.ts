import ArrayStore from "../types/ArrayStore.js";
import ForEachBlock from "./ForEachBlock.js";
import ForEachItemBuilder from "../types/ForEachItemBuilder.js";
import Store from "../types/Store.js";

export default
class ForEachBlockBuilder<T>
{
	_array: T[]|Store<T[]>|ArrayStore<T>;
	_build: ForEachItemBuilder<T>;

	constructor(array: T[]|Store<T[]>|ArrayStore<T>, build: ForEachItemBuilder<T>)
	{
		this._array = array;
		this._build = build;
	}

	endForEach(): ForEachBlock<T>
	{
		return new ForEachBlock<T>(this._array, this._build);
	}
}
