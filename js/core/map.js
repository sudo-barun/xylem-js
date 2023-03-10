import createDataNode from "./createDataNode.js";
import createEmittableStream from "./createEmittableStream.js";
export default function map(store, callback) {
    const getter = () => callback(store());
    const stream = createEmittableStream();
    store.subscribe((value) => stream(callback(value)));
    return createDataNode(getter, stream);
}
