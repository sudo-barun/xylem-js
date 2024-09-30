export default class UnsubscriberImpl {
    constructor(stream, subscriber) {
        this._stream = stream;
        this._subscriber = subscriber;
    }
    _() {
        const index = this._stream._subscribers.indexOf(this._subscriber);
        if (index !== -1) {
            this._stream._subscribers.splice(index, 1);
        }
        else {
            throw new Error('Failed to remove subscriber as it is not in the list of subscribers.');
        }
    }
}
