export default class FakeLifecycle {
    constructor() {
        this.beforeDetach = new FakeLifecycleEvent;
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
