import arrayStoreMutation from "./arrayStoreMutation.js";
import forEachBlockMutation from "../dom/_internal/forEachBlockMutation.js";
import handleUnshift from "./handleUnshift.js";
import handleUnshiftInForEachBlock from "../dom/_internal/handleUnshiftInForEachBlock.js";
import unshift from "./unshift.js";
arrayStoreMutation.registerHandler(unshift, handleUnshift);
forEachBlockMutation.registerHandler(unshift, handleUnshiftInForEachBlock);
