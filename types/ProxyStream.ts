import type Stream from "./Stream";
import type Unsubscriber from "./Unsubscriber";

type ProxyStream<T> = (
	Stream<T>
	&
	{ unsubscribe: () => void }
);

export { type ProxyStream as default };
