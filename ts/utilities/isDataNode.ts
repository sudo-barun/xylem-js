import DataNode from "../types/DataNode.js";

export default
function isDataNode<T>(dataNode: any|DataNode<T>): dataNode is DataNode<T>
{
	return (
		(typeof dataNode === 'object')
		&&
		(typeof dataNode['_'] === 'function')
		&&
		(typeof dataNode['subscribe'] === 'function')
	);
}
