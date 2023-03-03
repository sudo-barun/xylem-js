import arrayStoreMutation from "./core/arrayStoreMutation.js";
import forEachBlockMutation from "./dom/forEachBlockMutation.js";
import handleMove from "./core/handleMove.js";
import handleMoveInForEachBlock from "./dom/handleMoveInForEachBlock.js";
import move from "./core/move.js";
arrayStoreMutation.registerHandler(move, handleMove);
forEachBlockMutation.registerHandler(move, handleMoveInForEachBlock);
