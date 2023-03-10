import arrayStoreMutation from "./arrayStoreMutation.js";
import forEachBlockMutation from "../dom/_internal/forEachBlockMutation.js";
import handleMove from "./handleMove.js";
import handleMoveInForEachBlock from "../dom/_internal/handleMoveInForEachBlock.js";
import move from "./move.js";
arrayStoreMutation.registerHandler(move, handleMove);
forEachBlockMutation.registerHandler(move, handleMoveInForEachBlock);
