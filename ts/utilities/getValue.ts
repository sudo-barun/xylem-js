import Supplier from "../types/Supplier.js";
import isSupplier from "./isSupplier.js";

export default
function getValue<T>(value: T|Supplier<T>): T
{
	if (isSupplier<T>(value)) {
		return value._();
	}
	return value;
}
