export default function cumulate(sourceStore, callback, newValue) {
    return sourceStore(callback(sourceStore(), newValue));
}
;
