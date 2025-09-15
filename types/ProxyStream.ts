import type Stream from "./Stream";

type ProxyStream<T> = (
	Stream<T>
	&
	{ unsubscribe: () => void }
);

export { type ProxyStream as default };
