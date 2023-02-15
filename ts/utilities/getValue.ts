import Getter from "../types/Getter";

export default
function getValue<T>(value: T|Getter<T>)
{
	if (value instanceof Function) {
		return value();
	}
	return value;
}
