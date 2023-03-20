import handleUnshift from "../array/handleUnshift.js";
import handleUnshiftInArrayNormalization from "../array/handleUnshiftInArrayNormalization.js";
import handleUnshiftInForEachBlock from "../dom/_internal/handleUnshiftInForEachBlock.js";
const unshift = {
    _: handleUnshift,
    normalizeArrayStore: handleUnshiftInArrayNormalization,
    forEachBlock: handleUnshiftInForEachBlock,
};
export default unshift;
