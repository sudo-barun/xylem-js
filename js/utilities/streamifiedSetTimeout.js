import createStream from "../core/createStream.js";
export default function streamifiedSetTimeout(delay) {
    const stream = createStream();
    const intervalID = globalThis.setTimeout(stream, delay);
    const clear = () => clearInterval(intervalID);
    stream.clear = clear;
    return stream;
}
