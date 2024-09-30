export default function isSupplier(value) {
    return ((typeof value === 'object')
        &&
            (value !== null)
        &&
            (typeof value['_'] === 'function')
        &&
            (typeof value['subscribe'] === 'function'));
}
