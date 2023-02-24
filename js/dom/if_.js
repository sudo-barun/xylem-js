import IfElseBlockBuilder from "./IfElseBlockBuilder.js";
export default function if_(condition, getVirtualDom) {
    return new IfElseBlockBuilder(condition, getVirtualDom);
}
