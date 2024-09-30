import handlePush from "../array/handlePush.js";
import handlePushInArrayNormalization from "../array/handlePushInArrayNormalization.js";
import handlePushInForEachBlock from "../dom/_internal/handlePushInForEachBlock.js";

const push = {
	_: handlePush,
	normalizeArrayStore: handlePushInArrayNormalization,
	forEachBlock: handlePushInForEachBlock,
};

export default push;
