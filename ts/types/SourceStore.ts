import Setter from "./Setter";
import Store from "./Store";

type SourceStore<T> =
(
	Store<T>
	&
	Setter<T>
	&
	{ readonly: Store<T> }
	&
	{ [key: string] : any }
);

export default SourceStore;
