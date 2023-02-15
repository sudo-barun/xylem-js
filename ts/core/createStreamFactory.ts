import Emitter from "../types/Emitter.js";
import Stream from "../types/Stream.js";
import Subscriber from "../types/Subscriber.js";
import Unsubscriber from "../types/Unsubscriber.js";

function createEmitToSubscribers<T>(subscribers: Subscriber<T>[])
{
	return function emitToSubscribers(value: T): void
	{
		subscribers.forEach(subscriber => {
			subscriber.apply(null, arguments as any);
		});
	}
}

type emit<T> = (value: T) => void;

export default
function createStreamFactory<I,O>(callback: (emit: emit<O>, value: I) => void) 
{
	return factory;

	function factory(): (
		(Emitter<I> & Stream<O>)
		&
		{ subscribeOnly: Stream<O> }
		&
		{ [key: string] : any }
	) {

		const subscribers: Subscriber<O>[] = [];

		const emit = createEmitToSubscribers<O>(subscribers);

		const stream = function (value: I): void {
			if (arguments.length) {
				callback(emit, value);
			} else {
				(callback as (emit: emit<O>, value: void) => void)(emit);
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
		Object.defineProperty(stream, 'subscribeOnly', { value: subscribeOnly });

		return stream;
	};
}
