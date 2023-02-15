export default function reduce(sourceStore, callback) {
    return function (newValue) {
        return sourceStore(callback(sourceStore(), newValue));
    };
}
;
