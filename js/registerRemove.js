import arrayStoreMutation from "./core/arrayStoreMutation.js";
import forEachBlockMutation from "./dom/forEachBlockMutation.js";
import handleRemove from "./core/handleRemove.js";
import handleRemoveInForEachBlock from "./dom/handleRemoveInForEachBlock.js";
import remove from "./core/remove.js";
arrayStoreMutation.registerHandler(remove, handleRemove);
forEachBlockMutation.registerHandler(remove, handleRemoveInForEachBlock);
