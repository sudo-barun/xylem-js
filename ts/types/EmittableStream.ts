import Emitter from "./Emitter";
import Stream from "./Stream";

type EmittableStream<T> = (
	(Emitter<T> & Stream<T>)
	&
	{ subscribeOnly: Stream<T> }
	&
	{ [key: string] : any }
);

export default EmittableStream;
