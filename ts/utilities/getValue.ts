import DataNode from "../types/DataNode.js";
import isDataNode from "./isDataNode.js";

export default
function getValue<T>(value: T|DataNode<T>): T
{
	if (isDataNode<T>(value)) {
		return value._();
	}
	return value;
}
