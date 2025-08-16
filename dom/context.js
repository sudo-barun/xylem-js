let lastKey = 0;
export function generateContextKey(key = '') {
    lastKey += 1;
    return key + '__' + lastKey;
}
export class Context {
    constructor(data) {
        this._data = data;
    }
    getItem(key, default_) {
        if (key in this._data) {
            return this._data[key];
        }
        else if (arguments.length > 1) {
            return default_;
        }
        else {
            throw new Error('Context does not have key: ' + String(key) + ' and default value is not provided.');
        }
    }
    getAll() {
        return this._data;
    }
}
export function createContext(parentContext, contextData_) {
    const contextData = { ...contextData_ };
    Object.setPrototypeOf(contextData, parentContext ? parentContext.getAll() : null);
    Object.freeze(contextData);
    return new Context(contextData);
}
export const defaultContext = createContext(null, { $$DEBUG: false });
