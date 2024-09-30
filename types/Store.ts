import Supplier from "./Supplier";
import Setter from "./Setter";

type Store<T> =
(
	Supplier<T>
	&
	Setter<T>
	&
	{ readonly: Supplier<T> }
);

export default Store;
