import Emitter from "../types/Emitter.js";
import Stream from "../types/Stream.js";
import Subscriber from "../types/Subscriber.js";
import SubscriberFunction from "../types/SubscriberFunction.js";
import SubscriberObject from "../types/SubscriberObject.js";
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
		for (const subscriber of subscribers) {
			if (arguments.length) {
				if (typeof subscriber === 'function') {
					subscriber(value as O);
				} else {
					subscriber._(value as O);
				}
			} else {
				if (typeof subscriber === 'function') {
					(subscriber as SubscriberFunction<void>)();
				} else {
					(subscriber as SubscriberObject<void>)._();
				}
			}
		}
	};

	const stream: {
		_: (value: I) => void,
		subscribe: (subscriber: Subscriber<O>) => Unsubscriber,
		subscribeOnly: Stream<O>,
	} = {
		_: function (value: I) {
			if (callback) {
				callback(emit, value);
			} else {
				emit(value);
			}
		},
		subscribe: undefined!,
		subscribeOnly: undefined!,
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
		return {
			_: function () {
				removeSubscriber(subscriber);
			},
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
