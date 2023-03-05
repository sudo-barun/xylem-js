import createProxy from "../core/createProxy.js";
import createProxyStore from "../core/createProxyStore.js";
import createStream from "../core/createStream.js";
import Element from "./Element.js";
export default class Component {
    afterAttachToDom;
    beforeDetachFromDom;
    _attributes;
    _modifier;
    _virtualDom;
    _notifyAfterAttachToDom;
    _notifyBeforeDetachFromDom;
    _eventUnsubscribers;
    _firstNode;
    _lastNode;
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
    injectAttributes(attributes) {
        this._attributes = { ...attributes, ...this._attributes };
    }
    setModifier(modifier) {
        this._modifier = modifier;
    }
    setup(modifier) {
        if (arguments.length === 0) {
            modifier = this._modifier;
        }
        else {
            this._modifier = modifier;
        }
        if (modifier) {
            modifier(this);
        }
        const virtualDom = this.build(this._attributes);
        virtualDom.forEach(_vDom => {
            if ((_vDom instanceof Component) || (_vDom instanceof Element)) {
                _vDom.setup(modifier);
            }
        });
        this._virtualDom = virtualDom;
    }
    reload() {
        this.notifyBeforeDetachFromDom();
        this._virtualDom.forEach(vDomItem => {
            vDomItem.detachFromDom();
        });
        this._notifyAfterAttachToDom = createStream();
        this.afterAttachToDom = this._notifyAfterAttachToDom.subscribeOnly;
        this._notifyBeforeDetachFromDom = createStream();
        this.beforeDetachFromDom = this._notifyBeforeDetachFromDom.subscribeOnly;
        this.setup(this._modifier);
        this._virtualDom.forEach(vDom => {
            vDom.setupDom();
        });
        const nodes = this._virtualDom.map(vDom => {
            if (vDom instanceof Component) {
                return vDom.getDomNodes();
            }
            else {
                return [vDom.getDomNode()];
            }
        }).flat();
        nodes.forEach((node) => {
            this._lastNode.parentNode.insertBefore(node, this._lastNode);
        });
        this.notifyAfterAttachToDom();
    }
    getComponentName() {
        return Object.getPrototypeOf(this).constructor.name;
    }
    setupDom() {
        this._firstNode = new Comment(`${this.getComponentName()}`);
        this._lastNode = new Comment(`/${this.getComponentName()}`);
        this._virtualDom.forEach(vDom => {
            vDom.setupDom();
        });
    }
    getDomNodes() {
        const nodes = this._virtualDom.map(vDom => {
            if (vDom instanceof Component) {
                return vDom.getDomNodes();
            }
            else {
                return [vDom.getDomNode()];
            }
        }).flat();
        nodes.unshift(this._firstNode);
        nodes.push(this._lastNode);
        return nodes;
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
        return this._firstNode;
    }
    getLastNode() {
        return this._lastNode;
    }
    notifyAfterAttachToDom() {
        this._notifyAfterAttachToDom();
        this._virtualDom.forEach((vDomItem) => {
            if ((vDomItem instanceof Component) || (vDomItem instanceof Element)) {
                vDomItem.notifyAfterAttachToDom();
            }
        });
    }
    notifyBeforeDetachFromDom() {
        this._notifyBeforeDetachFromDom();
        this._virtualDom.forEach((vDomItem) => {
            if ((vDomItem instanceof Component) || (vDomItem instanceof Element)) {
                vDomItem.notifyBeforeDetachFromDom();
            }
        });
    }
    detachFromDom() {
        this._virtualDom.forEach((vDomItem) => {
            vDomItem.detachFromDom();
            this._firstNode.parentNode.removeChild(this._firstNode);
            this._lastNode.parentNode.removeChild(this._lastNode);
        });
    }
}
