let lastKey = 0;
export function generateContextKey(key = '') {
    lastKey += 1;
    return '#' + key + lastKey;
}
export function createContext(parentContext, contextData) {
    const context = { ...contextData };
    Object.setPrototypeOf(context, parentContext);
    Object.freeze(context);
    return context;
}
