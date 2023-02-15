import createStream from "../core/createStream.js";
export default function streamifiedSetInterval(delay) {
    const stream = createStream();
    const intervalID = globalThis.setInterval(stream, delay);
    const clear = () => clearInterval(intervalID);
    stream.clear = clear;
    return stream;
}
