import handleRemove from "../array/handleRemove.js";
import handleRemoveInArrayNormalization from "../array/handleRemoveInArrayNormalization.js";
import handleRemoveInForEachBlock from "../dom/_internal/handleRemoveInForEachBlock.js";
const remove = {
    _: handleRemove,
    normalizeArrayStore: handleRemoveInArrayNormalization,
    forEachBlock: handleRemoveInForEachBlock,
};
export default remove;
