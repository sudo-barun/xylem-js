const registeredArrayMutateActionAndHandlerList = [];
export function getArrayMutationHandler(arrayMutateAction) {
    for (let [action, handler] of registeredArrayMutateActionAndHandlerList) {
        if (action === arrayMutateAction) {
            return handler;
        }
    }
    return null;
}
function registerArrayMutationHandler(arrayMutateAction, arrayMutateHandler) {
    registeredArrayMutateActionAndHandlerList.push([arrayMutateAction, arrayMutateHandler]);
}
const forEachBlockMutation = {
    registerHandler: registerArrayMutationHandler,
    getHandler: getArrayMutationHandler,
};
export default forEachBlockMutation;
