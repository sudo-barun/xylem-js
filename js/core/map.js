import createProxyStore from "./createProxyStore.js";
import createStream from "./createStream.js";
export default function map(store, callback) {
    const getter = () => callback(store());
    const stream = createStream();
    store.subscribe((value) => stream(callback(value)));
    return createProxyStore(getter, stream);
}
