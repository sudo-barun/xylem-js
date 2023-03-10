import ComponentChildren from "../types/ComponentChildren.js";
import IfElseBlockBuilder from "./_internal/IfElseBlockBuilder.js";
import DataNode from "../types/DataNode.js";

export default
function if_(condition: DataNode<any>, getVirtualDom: () => ComponentChildren)
{
	return new IfElseBlockBuilder(condition, getVirtualDom);
}
