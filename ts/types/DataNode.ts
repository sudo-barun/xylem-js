import Getter from "./Getter";
import Stream from "./Stream";

type DataNode<T> = Getter<T> & Stream<T>;

export default DataNode;
