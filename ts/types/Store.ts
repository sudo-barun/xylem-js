import DataNode from "./DataNode";
import Setter from "./Setter";

type Store<T> =
(
	DataNode<T>
	&
	Setter<T>
	&
	{ readonly: DataNode<T> }
);

export default Store;
