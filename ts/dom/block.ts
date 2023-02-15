import ArrayStore from "../types/ArrayStore.js";
import ComponentItem from "../types/ComponentItem.js";
import ForEachBlock from "../dom/ForEachBlock.js";
import ForEachItemBuilder from "../types/ForEachItemBuilder.js";
import IfBlock from "../dom/IfBlock.js";
import Store from "../types/Store.js";

const block = {
	if: function (condition: Store<any>, getVirtualDom: () => Array<ComponentItem>) {
		// TODO: migrate build logic here from IfBlock
		return new IfBlock(condition, getVirtualDom);
	},

	forEach: function<T> (array: T[]|Store<T[]>|ArrayStore<T>, build: ForEachItemBuilder<T>) {
		return new ForEachBlock(array, build);
	},
};

export default block;
