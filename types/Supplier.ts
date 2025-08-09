import type Getter from "./Getter";
import type Stream from "./Stream";

type Supplier<T> = Getter<T> & Stream<T>;

export { type Supplier as default };
