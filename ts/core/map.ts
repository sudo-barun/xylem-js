import createDataNode from "./createDataNode.js";
import createEmittableStream from "./createEmittableStream.js";
import DataNode from "../types/DataNode.js";

export default
function map<T>(store: DataNode<T>, callback: (value: T) => T): DataNode<T>

export default
function map<I,O>(store: DataNode<I>, callback: (value: I) => O): DataNode<O>

export default
function map<I,O>(store: DataNode<I>, callback: (value: I) => O): DataNode<O>
{
	const getter = () => callback(store());
	const stream = createEmittableStream<O>();
	store.subscribe((value) => stream(callback(value)))
	return createDataNode(getter, stream);
}
