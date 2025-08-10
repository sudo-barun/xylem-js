export default class FakeLifecycle {
    constructor() {
        this.beforeDetachFromDom = new FakeLifecycleEvent;
    }
}
class FakeLifecycleEvent {
    subscribe() {
        return noop;
    }
}
const noop = {
    _: () => { },
};
