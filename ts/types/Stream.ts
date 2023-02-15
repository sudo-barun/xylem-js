import Subscriber from "./Subscriber";
import Unsubscriber from "./Unsubscriber";

type Stream<T> = {
	subscribe: (subscriber: Subscriber<T>) => Unsubscriber;
}

export default Stream;
