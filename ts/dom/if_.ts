import IfElseBlockBuilder from "./_internal/IfElseBlockBuilder.js";
import IfElseBuild from "../types/_internal/IfElseBuild.js";
import DataNode from "../types/DataNode.js";

export default
function if_(condition: DataNode<any>, build: IfElseBuild)
{
	return new IfElseBlockBuilder(condition, build);
}
