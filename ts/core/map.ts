import Store from "../types/Store.js";
import createProxyStore from "./createProxyStore.js";
import createStream from "./createStream.js";

export default
function map<T>(store: Store<T>, callback: (value: T) => T): Store<T>

export default
function map<I,O>(store: Store<I>, callback: (value: I) => O): Store<O>

export default
function map<I,O>(store: Store<I>, callback: (value: I) => O): Store<O>
{
	const getter = () => callback(store());
	const stream = createStream<O>();
	store.subscribe((value) => stream(callback(value)))
	return createProxyStore(getter, stream);
}
