import ArrayMutateAction from "../types/ArrayMutateAction.js";

type Handler = <T>(...args: any[]) => void;

const registeredArrayMutateActionAndHandlerList: Array<[ArrayMutateAction, Handler]> = [];

export
function getArrayMutationHandler(arrayMutateAction: ArrayMutateAction): Handler|null
{
	for (let [action, handler] of registeredArrayMutateActionAndHandlerList) {
		if (action === arrayMutateAction) {
			return handler;
		}
	}
	return null;
}

function registerArrayMutationHandler(
	arrayMutateAction: ArrayMutateAction,
	arrayMutateHandler: Handler
): void
{
	registeredArrayMutateActionAndHandlerList.push([arrayMutateAction, arrayMutateHandler]);
}

const forEachBlockMutation = {
	registerHandler: registerArrayMutationHandler,
	getHandler: getArrayMutationHandler,
};

export default forEachBlockMutation;
