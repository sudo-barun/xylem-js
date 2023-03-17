export default function isSupplier(value) {
    return ((typeof value === 'object')
        &&
            (typeof value['_'] === 'function')
        &&
            (typeof value['subscribe'] === 'function'));
}
