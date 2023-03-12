export default function isDataNode(dataNode) {
    return ((typeof dataNode === 'object')
        &&
            (typeof dataNode['_'] === 'function')
        &&
            (typeof dataNode['subscribe'] === 'function'));
}
