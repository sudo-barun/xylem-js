import ComponentItem from "../types/ComponentItem.js";
import IfElseBlockBuilder from "./IfElseBlockBuilder.js";
import Store from "../types/Store.js";

export default
function if_(condition: Store<any>, getVirtualDom: () => Array<ComponentItem>)
{
	return new IfElseBlockBuilder(condition, getVirtualDom);
}
