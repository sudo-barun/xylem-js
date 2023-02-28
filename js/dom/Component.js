import createProxy from "../core/createProxy.js";
import createProxyStore from "../core/createProxyStore.js";
import createStream from "../core/createStream.js";
import Element from "./Element.js";
export default class Component {
    afterAttachToDom;
    beforeDetachFromDom;
    _attributes;
    _virtualDom;
    _notifyAfterAttachToDom;
    _notifyBeforeDetachFromDom;
    _eventUnsubscribers;
    constructor(attributes = {}) {
        this._attributes = attributes;
        this._notifyAfterAttachToDom = createStream();
        this.afterAttachToDom = this._notifyAfterAttachToDom.subscribeOnly;
        this._notifyBeforeDetachFromDom = createStream();
        this.beforeDetachFromDom = this._notifyBeforeDetachFromDom.subscribeOnly;
        this._eventUnsubscribers = [];
    }
    build(attributes) {
        throw new Error('Method "build" is not implemented in class '
            + Object.getPrototypeOf(this).constructor.name);
    }
    setup() {
        const oldVirtualDom = this._virtualDom;
        const newVirtualDom = this.build(this._attributes);
        newVirtualDom.forEach(_vDom => {
            if ((_vDom instanceof Component) || (_vDom instanceof Element)) {
                _vDom.setup();
            }
        });
        if (oldVirtualDom) {
            const lastNode = this.getLastNode();
            const parentNode = lastNode?.parentNode;
            newVirtualDom.forEach(vDom => vDom.setupDom());
            if (parentNode) {
                newVirtualDom.slice().reverse().forEach((vDom) => {
                    if (vDom instanceof Component) {
                        vDom.getDomNodes().forEach((node) => {
                            parentNode.insertBefore(node, lastNode.nextSibling);
                        });
                    }
                    else {
                        parentNode.insertBefore(vDom.getDomNode(), lastNode.nextSibling);
                    }
                });
            }
            oldVirtualDom.forEach(vDom => vDom.detachFromDom());
        }
        this._virtualDom = newVirtualDom;
    }
    setupDom() {
        this._virtualDom.forEach(vDom => {
            vDom.setupDom();
        });
    }
    getDomNodes() {
        return this._virtualDom.map(vDom => {
            if (vDom instanceof Component) {
                return vDom.getDomNodes();
            }
            else {
                return [vDom.getDomNode()];
            }
        }).flat();
    }
    getVirtualDom() {
        return this._virtualDom;
    }
    createProxyStore(store) {
        const proxy = createProxyStore(store, store);
        this.beforeDetachFromDom.subscribe(() => {
            proxy.unsubscribeFromSource();
        });
        return proxy;
    }
    deriveStore(immutSubFuncVar) {
        return createProxy(immutSubFuncVar, this.beforeDetachFromDom.subscribe);
    }
    getFirstNode() {
        if (this._virtualDom) {
            for (const vDom of this._virtualDom) {
                let node = null;
                if (vDom instanceof Component) {
                    node = vDom.getFirstNode();
                    if (node !== null) {
                        return node;
                    }
                }
                else {
                    return vDom.getDomNode();
                }
            }
        }
        return null;
    }
    getLastNode() {
        if (this._virtualDom) {
            for (const vDom of this._virtualDom.slice().reverse()) {
                if (vDom instanceof Component) {
                    let node = null;
                    node = vDom.getLastNode();
                    if (node !== null) {
                        return node;
                    }
                }
                else {
                    return vDom.getDomNode();
                }
            }
        }
        return null;
    }
    attachToDom() {
        this._notifyAfterAttachToDom();
        this._virtualDom.forEach((vDomItem) => {
            if ((vDomItem instanceof Component) || (vDomItem instanceof Element)) {
                vDomItem.attachToDom();
            }
        });
    }
    detachFromDom() {
        this._notifyBeforeDetachFromDom();
        this._virtualDom.forEach(vDom => vDom.detachFromDom());
    }
}
