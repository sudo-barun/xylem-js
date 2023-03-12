import Stream from "./Stream";
import Unsubscriber from "./Unsubscriber";

type ProxyStream<T> = (
	Stream<T>
	&
	{ unsubscribe: () => void }
);

export default ProxyStream;
