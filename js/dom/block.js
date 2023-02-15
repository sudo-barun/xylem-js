import ForEachBlock from "../dom/ForEachBlock.js";
import IfBlock from "../dom/IfBlock.js";
const block = {
    if: function (condition, getVirtualDom) {
        // TODO: migrate build logic here from IfBlock
        return new IfBlock(condition, getVirtualDom);
    },
    forEach: function (array, build) {
        return new ForEachBlock(array, build);
    },
};
export default block;
