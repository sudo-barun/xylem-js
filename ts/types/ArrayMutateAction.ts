import SourceStore from "./SourceStore";
import Store from "./Store";

type ArrayMutateAction = <T>(
	array: T[],
	index$Array: SourceStore<number>[],
	item?: T,
	index$?: Store<number>
) => any;

export default ArrayMutateAction;
