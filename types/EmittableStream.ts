import type Emitter from "./Emitter";
import type Stream from "./Stream";

type EmittableStream<T> = (
	(Emitter<T> & Stream<T>)
	&
	{ subscribeOnly: Stream<T> }
);

export { type EmittableStream as default };
