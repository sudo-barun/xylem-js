const NativeComponentMixin = {
    domNodes() {
        return [this.domNode()];
    },
    firstNode() {
        return this.domNode();
    },
    lastNode() {
        return this.domNode();
    },
    domNode(domNode) {
        if (arguments.length !== 0) {
            this._domNode = domNode;
        }
        return this._domNode;
    },
    detachFromDom() {
        this._domNode.parentNode.removeChild(this._domNode);
    }
};
export default function applyNativeComponentMixin(constructor) {
    for (const name of Object.getOwnPropertyNames(NativeComponentMixin)) {
        if (constructor.prototype.hasOwnProperty(name)) {
            return;
        }
        Object.defineProperty(constructor.prototype, name, Object.getOwnPropertyDescriptor(NativeComponentMixin, name) ||
            Object.create(null));
    }
}
