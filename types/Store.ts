import type Supplier from "./Supplier";
import type Setter from "./Setter";

type Store<T> =
(
	Supplier<T>
	&
	Setter<T>
	&
	{ readonly: Supplier<T> }
);

export { type Store as default };
