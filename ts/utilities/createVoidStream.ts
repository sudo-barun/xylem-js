import EmittableStream from "../types/EmittableStream.js";
import createStreamFactory from "../core/createStreamFactory.js";

const createVoidStream = createStreamFactory<void,void>((emit) => {
	emit();
}) as () => EmittableStream<void>;

export default createVoidStream;
