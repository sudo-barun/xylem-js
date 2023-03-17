import Supplier from "../types/Supplier.js";

export default
function isSupplier<T>(value: any|Supplier<T>): value is Supplier<T>
{
	return (
		(typeof value === 'object')
		&&
		(typeof value['_'] === 'function')
		&&
		(typeof value['subscribe'] === 'function')
	);
}
