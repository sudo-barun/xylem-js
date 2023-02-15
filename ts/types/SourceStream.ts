import Emitter from "./Emitter";
import Stream from "./Stream";

type SourceStream<T> = (
	(Emitter<T> & Stream<T>)
	&
	{ subscribeOnly: Stream<T> }
	&
	{ [key: string] : any }
);

export default SourceStream;
