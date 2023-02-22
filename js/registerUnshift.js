import arrayStoreMutation from "./core/arrayStoreMutation.js";
import forEachBlockMutation from "./dom/forEachBlockMutation.js";
import handleUnshift from "./core/handleUnshift.js";
import handleUnshiftInForEachBlock from "./dom/handleUnshiftInForEachBlock.js";
import unshift from "./core/unshift.js";
arrayStoreMutation.registerHandler(unshift, handleUnshift);
forEachBlockMutation.registerHandler(unshift, handleUnshiftInForEachBlock);
