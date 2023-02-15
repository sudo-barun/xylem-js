export default function createStore(value) {
    return _createStore({
        value,
        subscribers: [],
    });
}
function _createStore(state) {
    const subscribers = state.subscribers;
    const store = function (newValue) {
        if (arguments.length === 0) {
            return state.value;
        }
        else {
            const isDifferent = state.value !== newValue;
            state.value = newValue;
            if (isDifferent) {
                subscribers.forEach(subscriber => subscriber(state.value));
            }
            return state.value;
        }
    };
    const removeSubscriber = function (subscriber) {
        const index = subscribers.indexOf(subscriber);
        if (index !== -1) {
            subscribers.splice(index, 1);
        }
        else {
            throw new Error('Failed to remove subscriber as it is not in the list of subscribers.');
        }
    };
    const subscribe = function (subscriber) {
        subscribers.push(subscriber);
        return function () {
            removeSubscriber(subscriber);
        };
    };
    const readonlyStore = function () {
        if (arguments.length > 0) {
            throw new Error('Setting value is not allowed');
        }
        return store();
    };
    Object.defineProperty(readonlyStore, '_state', { value: state });
    readonlyStore.subscribe = subscribe;
    Object.defineProperty(readonlyStore, 'subscribe', { value: subscribe });
    Object.defineProperty(store, '_state', { value: state });
    store.subscribe = subscribe;
    Object.defineProperty(store, 'subscribe', { value: subscribe });
    store.readonly = readonlyStore;
    Object.defineProperty(store, 'readonly', { value: readonlyStore });
    return store;
}
