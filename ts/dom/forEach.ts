import ArrayStore from "../types/ArrayStore.js";
import ForEachBlockBuilder from "./ForEachBlockBuilder.js";
import ForEachItemBuilder from "../types/ForEachItemBuilder.js";
import Store from "../types/Store.js";

export default
function forEach<T>(array: T[]|Store<T[]>|ArrayStore<T>, build: ForEachItemBuilder<T>)
{
	return new ForEachBlockBuilder(array, build);
}
