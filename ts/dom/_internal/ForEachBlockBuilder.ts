import ArraySupplier from "../../types/ArraySupplier.js";
import ForEachBlock from "./ForEachBlock.js";
import ForEachBuild from "../../types/_internal/ForEachBuild.js";
import Supplier from "../../types/Supplier.js";

export default
class ForEachBlockBuilder<T>
{
	declare _array: T[]|Supplier<T[]>|ArraySupplier<T>;
	declare _build: ForEachBuild<T>;

	constructor(array: T[]|Supplier<T[]>|ArraySupplier<T>, build: ForEachBuild<T>)
	{
		this._array = array;
		this._build = build;
	}

	endForEach(): ForEachBlock<T>
	{
		return new ForEachBlock<T>({
			array: this._array,
			build: this._build
		});
	}
}
