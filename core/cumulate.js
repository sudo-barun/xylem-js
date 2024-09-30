export default function cumulate(sourceStore, callback, newValue) {
    return sourceStore._(callback(sourceStore._(), newValue));
}
;
