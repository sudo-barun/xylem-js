const NativeComponentMixin = {
    getDomNode() {
        return this._domNode;
    },
    getDomNodes() {
        return [this.getDomNode()];
    },
    getFirstNode() {
        return this.getDomNode();
    },
    getLastNode() {
        return this.getDomNode();
    },
    setDomNode(domNode) {
        this._domNode = domNode;
    },
    detachFromDom() {
        this._domNode.parentNode.removeChild(this._domNode);
    }
};
export default function applyNativeComponentMixin(constructor) {
    Object.getOwnPropertyNames(NativeComponentMixin).forEach((name) => {
        if (constructor.prototype.hasOwnProperty(name)) {
            return;
        }
        Object.defineProperty(constructor.prototype, name, Object.getOwnPropertyDescriptor(NativeComponentMixin, name) ||
            Object.create(null));
    });
}
