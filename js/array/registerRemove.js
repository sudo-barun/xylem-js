import arrayStoreMutation from "./arrayStoreMutation.js";
import forEachBlockMutation from "../dom/_internal/forEachBlockMutation.js";
import handleRemove from "./handleRemove.js";
import handleRemoveInForEachBlock from "../dom/_internal/handleRemoveInForEachBlock.js";
import remove from "./remove.js";
arrayStoreMutation.registerHandler(remove, handleRemove);
forEachBlockMutation.registerHandler(remove, handleRemoveInForEachBlock);
