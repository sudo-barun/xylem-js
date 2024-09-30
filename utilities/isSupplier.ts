import Supplier from "../types/Supplier.js";

export default
function isSupplier<T>(value: unknown): value is Supplier<T>
{
	return (
		(typeof value === 'object')
		&&
		(value !== null)
		&&
		(typeof (value as {_?: unknown})['_'] === 'function')
		&&
		(typeof (value as {subscribe?: unknown})['subscribe'] === 'function')
	);
}
