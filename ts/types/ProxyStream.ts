import Stream from "./Stream";
import Unsubscriber from "./Unsubscriber";

type ProxyStream<T> = (
	Stream<T>
	&
	{ unsubscribe: Unsubscriber }
);

export default ProxyStream;
