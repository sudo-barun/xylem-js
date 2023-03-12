import createStream from "../core/createStream.js";
export default function createStreamOfDomEvent(eventTarget, eventName) {
    return createStream((emitter) => {
        const eventListener = new EventListener(emitter);
        eventTarget.addEventListener(eventName, eventListener);
        return new EventListenerRemover(eventTarget, eventName, eventListener);
    });
}
class EventListener {
    constructor(emitter) {
        this._emitter = emitter;
    }
    handleEvent(event) {
        this._emitter._(event);
    }
}
class EventListenerRemover {
    constructor(eventTarget, eventName, eventListener) {
        this._eventTarget = eventTarget;
        this._eventName = eventName;
        this._eventListener = eventListener;
    }
    _() {
        this._eventTarget.removeEventListener(this._eventName, this._eventListener);
    }
}
