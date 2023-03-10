import createStream from "../core/createStream.js";
export default function createStreamOfDomEvent(eventTarget, eventName) {
    return createStream((emitter) => {
        eventTarget.addEventListener(eventName, emitter);
        return () => {
            eventTarget.removeEventListener(eventName, emitter);
        };
    });
}
