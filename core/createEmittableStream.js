import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";
export default function createEmittableStream() {
    return new EmittableStreamImpl();
}
class EmittableStreamImpl {
    constructor() {
        this._subscribers = [];
        this.subscribeOnly = new SubscribeOnlyStream(this);
    }
    _(value) {
        const callSubscribers = new CallSubscribers(this);
        callSubscribers._.apply(callSubscribers, arguments);
    }
    subscribe(subscriber) {
        this._subscribers.push(subscriber);
        return new UnsubscriberImpl(this, subscriber);
    }
}
class SubscribeOnlyStream {
    constructor(source) {
        this._source = source;
    }
    subscribe(subscriber) {
        return this._source.subscribe(subscriber);
    }
}
