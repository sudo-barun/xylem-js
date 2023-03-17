import ArrayMutateAction from "../types/ArrayMutateAction.js";
import Supplier from "../types/Supplier.js";
import Emitter from "../types/Emitter.js";

type Handler = <T,U>(
	createStoreForItem: (item: T) => Supplier<U>,
	emit: Emitter<U[]>,
	itemStores: Supplier<U>[],
	...mutationArgs: any[]
) => void;

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
	arrayMutateHandler: (...args: any[]) => void
): void
{
	registeredArrayMutateActionAndHandlerList.push([arrayMutateAction, arrayMutateHandler]);
}

const arrayStoreMutation = {
	registerHandler: registerArrayMutationHandler,
	getHandler: getArrayMutationHandler,
};

export default arrayStoreMutation;
