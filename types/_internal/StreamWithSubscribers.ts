import Stream from "../Stream";
import Subscriber from "../Subscriber";

type StreamWithSubscribers<T> = (
	Stream<T>
	&
	{ _subscribers: Subscriber<T>[] }
);

export default StreamWithSubscribers;
