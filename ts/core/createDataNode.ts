import DataNode from "../types/DataNode.js";
import Getter from "../types/Getter.js";
import Stream from "../types/Stream.js";
import Subscriber from "../types/Subscriber.js";

export default
function createDataNode<T>(
	getter: Getter<T>,
	stream: Stream<T>
): DataNode<T>
{
	const subscribers: Subscriber<T>[] = [];
	const dataNode = () => getter();

	const unsubscribeFromSource = stream.subscribe((value) => {
		subscribers.forEach(subscriber => subscriber(value));
	});

	const removeSubscriber = function (subscriber: Subscriber<T>)
	{
		const index = subscribers.indexOf(subscriber);
		if (index !== -1) {
			subscribers.splice(index, 1);
		}
	};

	const subscribe = function (subscriber: Subscriber<T>)
	{
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
