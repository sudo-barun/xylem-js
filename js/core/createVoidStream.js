import createStreamFactory from "./createStreamFactory.js";
const createVoidStream = createStreamFactory((emit) => {
    emit();
});
export default createVoidStream;
