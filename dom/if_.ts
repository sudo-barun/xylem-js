import IfElseBlockBuilder from "./_internal/IfElseBlockBuilder.js";
import type IfElseBuild from "../types/_internal/IfElseBuild.js";

export default
function if_(condition: unknown, build: IfElseBuild)
{
	return new IfElseBlockBuilder(condition, build);
}
