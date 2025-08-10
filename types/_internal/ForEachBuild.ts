import type ComponentChildren from "../ComponentChildren";
import type Supplier from "../Supplier";
import type ForEachBlockItem from "../../dom/_internal/ForEachBlockItem";
import type FunctionOrCallableObject from "../FunctionOrCallableObject";

type ForEachBuild<T> = FunctionOrCallableObject<ForEachBlockItem<T>, [
	item: T,
	index$: Supplier<number>,
	component: ForEachBlockItem<T>,
], ComponentChildren>;

export { type ForEachBuild as default };
