import type Stream from "../Stream";
import type Subscriber from "../Subscriber";

type StreamWithSubscribers<T> = (
	Stream<T>
	&
	{ _subscribers: Subscriber<T>[] }
);

export { type StreamWithSubscribers as default };
