import handleMove from "../array/handleMove.js";
import handleMoveInArrayNormalization from "../array/handleMoveInArrayNormalization.js";
import handleMoveInForEachBlock from "../dom/_internal/handleMoveInForEachBlock.js";
const move = {
    _: handleMove,
    normalizeArrayStore: handleMoveInArrayNormalization,
    forEachBlock: handleMoveInForEachBlock,
};
export default move;
