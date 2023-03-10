import IfElseBlockBuilder from "./_internal/IfElseBlockBuilder.js";
export default function if_(condition, build) {
    return new IfElseBlockBuilder(condition, build);
}
