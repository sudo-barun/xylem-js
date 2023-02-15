import SourceStream from "../types/SourceStream.js";
import createStreamFactory from "./createStreamFactory.js";

const createVoidStream = createStreamFactory<void,void>((emit) => {
	emit();
}) as () => SourceStream<void>;

export default createVoidStream;
