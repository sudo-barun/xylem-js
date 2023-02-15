import Getter from "./Getter";
import NonVoidUnaryFunction from "./NonVoidUnaryFunction";
import Store from "./Store";
import Stream from "./Stream";

type ReducedSourceStore<Arg,Ret> =
(
	(Getter<Ret> & NonVoidUnaryFunction<Arg,Ret> & Stream<Ret>)
	&
	{ readonly: Store<Ret> }
	&
	{ [key: string] : any }
);

export default ReducedSourceStore;
