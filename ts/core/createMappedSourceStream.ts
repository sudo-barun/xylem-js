import Emitter from "../types/Emitter.js";
import Stream from "../types/Stream.js";
import Subscriber from "../types/Subscriber.js";
import Unsubscriber from "../types/Unsubscriber.js";

export
type MappedSourceStream<I,O> = Emitter<I> & Stream<O>;

export default
function createMappedSourceStream<T>(
	callback?: (emit: (value: T) => void, value: T) => void
): MappedSourceStream<T,T>;

export default
function createMappedSourceStream<I,O>(
	callback?: (emit: (value: I|O) => void, value: I) => void
): MappedSourceStream<I,O>;

export default
function createMappedSourceStream<I,O>(
	callback?: (emit: (value: I|O) => void, value: I) => void
): MappedSourceStream<I,O>
{
	const subscribers: Subscriber<O>[] = [];

	const emit = function (value: I|O): void {
		subscribers.forEach(subscriber => {
			if (arguments.length) {
				subscriber(value as O);
			} else {
				(subscriber as Subscriber<void>)();
			}
		});
	};

	const stream = function (value: I) {
		if (callback) {
			callback(emit, value);
		} else {
			emit(value);
		}
	};

	const removeSubscriber = function (subscriber: Subscriber<O>)
	{
		const index = subscribers.indexOf(subscriber);
		if (index !== -1) {
			subscribers.splice(index, 1);
		}
	};

	const subscribe = function (subscriber: Subscriber<O>): Unsubscriber
	{
		subscribers.push(subscriber);
		return function () {
			removeSubscriber(subscriber);
		};
	};

	stream.subscribe = subscribe;

	Object.defineProperty(stream, 'subscribers', { value: subscribers });

	const subscribeOnly: Stream<O> = {
		subscribe,
	};

	stream.subscribeOnly = subscribeOnly;

	return stream;
}
