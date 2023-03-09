import createProxy from "../core/createProxy.js";
import createProxyStore from "../core/createProxyStore.js";
import createStream from "../core/createStream.js";
import Element from "./Element.js";
export default class Component {
    constructor(attributes = {}) {
        this._attributes = attributes;
        this._notifyAfterAttachToDom = createStream();
        this.afterAttachToDom = this._notifyAfterAttachToDom.subscribeOnly;
        this._notifyBeforeDetachFromDom = createStream();
        this.beforeDetachFromDom = this._notifyBeforeDetachFromDom.subscribeOnly;
        this._eventUnsubscribers = [];
        this._modifier = undefined;
        this._virtualDom = undefined;
        this._firstNode = undefined;
        this._lastNode = undefined;
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
        this.getChildNodes().forEach((node) => {
            this._lastNode.parentNode.insertBefore(node, this._lastNode);
        });
        this.notifyAfterAttachToDom();
    }
    getComponentName() {
        const componentName = Object.getPrototypeOf(this).constructor.name;
        return typeof componentName === 'string' ? componentName : '';
    }
    setupDom() {
        this._firstNode = this._firstNode || document.createComment(`${this.getComponentName()}`);
        this._lastNode = this._lastNode || document.createComment(`/${this.getComponentName()}`);
        this._virtualDom.forEach(vDom => {
            vDom.setupDom();
        });
    }
    getDomNodes() {
        const nodes = this.getChildNodes();
        nodes.unshift(this._firstNode);
        nodes.push(this._lastNode);
        return nodes;
    }
    getChildNodes() {
        return this._virtualDom.map(vDom => vDom.getDomNodes())
            .reduce((acc, item) => {
            acc.push(...item);
            return acc;
        }, []);
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
    setFirstNode(node) {
        this._firstNode = node;
    }
    getLastNode() {
        return this._lastNode;
    }
    setLastNode(node) {
        this._lastNode = node;
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
