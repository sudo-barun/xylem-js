import type Subscriber from "./Subscriber";
import type Unsubscriber from "./Unsubscriber";

type Stream<T> = {
	subscribe: (subscriber: Subscriber<T>) => Unsubscriber;
}

export { type Stream as default };
