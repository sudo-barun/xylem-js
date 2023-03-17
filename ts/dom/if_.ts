import IfElseBlockBuilder from "./_internal/IfElseBlockBuilder.js";
import IfElseBuild from "../types/_internal/IfElseBuild.js";
import Supplier from "../types/Supplier.js";

export default
function if_(condition: Supplier<any>, build: IfElseBuild)
{
	return new IfElseBlockBuilder(condition, build);
}
