import Getter from "./Getter";
import Stream from "./Stream";

type Store<T> = Getter<T> & Stream<T>;

export default Store;
