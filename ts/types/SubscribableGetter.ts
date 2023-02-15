import Getter from "./Getter";
import Stream from "./Stream";

type SubscribableGetter<T> = Getter<T> & Stream<T>;

export default SubscribableGetter;
