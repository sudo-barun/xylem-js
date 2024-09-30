import ComponentChildren from "../ComponentChildren";
import Supplier from "../Supplier";
import ForEachBlockItem from "../../dom/_internal/ForEachBlockItem";
import FunctionOrCallableObject from "../FunctionOrCallableObject";

type ForEachBuild<T> = FunctionOrCallableObject<[
	item: T,
	index$: Supplier<number>,
	component: ForEachBlockItem<T>,
], ComponentChildren>;

export default ForEachBuild;
