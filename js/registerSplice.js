import arrayStoreMutation from "./core/arrayStoreMutation.js";
import forEachBlockMutation from "./dom/forEachBlockMutation.js";
import handleSplice from "./core/handleSplice.js";
import handleSpliceInForEachBlock from "./dom/handleSpliceInForEachBlock.js";
import splice from "./core/splice.js";
arrayStoreMutation.registerHandler(splice, handleSplice);
forEachBlockMutation.registerHandler(splice, handleSpliceInForEachBlock);
