import createStreamFactory from "../core/createStreamFactory.js";
const createVoidStream = createStreamFactory((emit) => {
    emit();
});
export default createVoidStream;
