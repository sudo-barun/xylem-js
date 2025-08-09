import type ArraySupplier from "../types/ArraySupplier.js";
import ForEachBlockBuilder from "./_internal/ForEachBlockBuilder.js";
import type ForEachBuild from "../types/_internal/ForEachBuild.js";
import type Supplier from "../types/Supplier.js";

export default
function forEach<T>(array: T[]|Supplier<T[]>|ArraySupplier<T>, build: ForEachBuild<T>)
{
	return new ForEachBlockBuilder(array, build);
}
