import arrayStoreMutation from "./core/arrayStoreMutation.js";
import forEachBlockMutation from "./dom/forEachBlockMutation.js";
import handlePush from "./core/handlePush.js";
import handlePushInForEachBlock from "./dom/handlePushInForEachBlock.js";
import push from "./core/push.js";
arrayStoreMutation.registerHandler(push, handlePush);
forEachBlockMutation.registerHandler(push, handlePushInForEachBlock);
