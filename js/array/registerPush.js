import arrayStoreMutation from "./arrayStoreMutation.js";
import forEachBlockMutation from "../dom/_internal/forEachBlockMutation.js";
import handlePush from "./handlePush.js";
import handlePushInForEachBlock from "../dom/_internal/handlePushInForEachBlock.js";
import push from "./push.js";
arrayStoreMutation.registerHandler(push, handlePush);
forEachBlockMutation.registerHandler(push, handlePushInForEachBlock);
