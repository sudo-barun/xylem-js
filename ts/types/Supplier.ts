import Getter from "./Getter";
import Stream from "./Stream";

type Supplier<T> = Getter<T> & Stream<T>;

export default Supplier;
