export default function reduce(sourceStore, callback, newValue) {
    return sourceStore(callback(sourceStore(), newValue));
}
;
