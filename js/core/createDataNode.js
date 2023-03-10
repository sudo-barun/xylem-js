export default function createDataNode(getter, stream) {
    const subscribers = [];
    const dataNode = () => getter();
    const unsubscribeFromSource = stream.subscribe((value) => {
        subscribers.forEach(subscriber => subscriber(value));
    });
    const removeSubscriber = function (subscriber) {
        const index = subscribers.indexOf(subscriber);
        if (index !== -1) {
            subscribers.splice(index, 1);
        }
    };
    const subscribe = function (subscriber) {
        subscribers.push(subscriber);
        return function () {
            removeSubscriber(subscriber);
        };
    };
    dataNode.subscribe = subscribe;
    Object.defineProperty(dataNode, 'subscribe', { value: subscribe });
    Object.defineProperty(dataNode, 'source', { value: { getter, stream } });
    dataNode.unsubscribeFromSource = unsubscribeFromSource;
    Object.defineProperty(dataNode, 'unsubscribeFromSource', { value: unsubscribeFromSource });
    return dataNode;
}
