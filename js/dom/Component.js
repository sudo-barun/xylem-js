import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import createEmittableStream from "../core/createEmittableStream.js";
import ElementComponent from "./_internal/ElementComponent.js";
import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";
export default class Component {
    constructor(attributes = {}) {
        this._attributes = attributes;
        this._notifyAfterAttachToDom = createEmittableStream();
        this.afterAttachToDom = this._notifyAfterAttachToDom.subscribeOnly;
        this._notifyBeforeDetachFromDom = createEmittableStream();
        this.beforeDetachFromDom = this._notifyBeforeDetachFromDom.subscribeOnly;
        this._eventUnsubscribers = [];
        this._modifier = undefined;
        this._children = undefined;
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
        const children = this.build(this._attributes);
        children.forEach(_vDom => {
            if ((_vDom instanceof Component) || (_vDom instanceof ElementComponent)) {
                _vDom.setup(modifier);
            }
        });
        this._children = children;
    }
    reload() {
        this.notifyBeforeDetachFromDom();
        this._children.forEach(vDomItem => {
            vDomItem.detachFromDom();
        });
        this._notifyAfterAttachToDom = createEmittableStream();
        this.afterAttachToDom = this._notifyAfterAttachToDom.subscribeOnly;
        this._notifyBeforeDetachFromDom = createEmittableStream();
        this.beforeDetachFromDom = this._notifyBeforeDetachFromDom.subscribeOnly;
        this.setup(this._modifier);
        this._children.forEach(vDom => {
            vDom.setupDom();
        });
        this.childNodes().forEach((node) => {
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
        this._children.forEach(vDom => {
            vDom.setupDom();
        });
    }
    domNodes() {
        const nodes = this.childNodes();
        nodes.unshift(this._firstNode);
        nodes.push(this._lastNode);
        return nodes;
    }
    childNodes() {
        return this._children.map(vDom => vDom.domNodes())
            .reduce((acc, item) => {
            acc.push(...item);
            return acc;
        }, []);
    }
    children() {
        return this._children;
    }
    firstNode(node) {
        if (arguments.length !== 0) {
            this._firstNode = node;
        }
        return this._firstNode;
    }
    lastNode(node) {
        if (arguments.length !== 0) {
            this._lastNode = node;
        }
        return this._lastNode;
    }
    notifyAfterAttachToDom() {
        this._notifyAfterAttachToDom._();
        this._children.forEach((vDomItem) => {
            if ((vDomItem instanceof Component) || (vDomItem instanceof ElementComponent)) {
                vDomItem.notifyAfterAttachToDom();
            }
        });
    }
    notifyBeforeDetachFromDom() {
        this._notifyBeforeDetachFromDom._();
        this._children.forEach((vDomItem) => {
            if ((vDomItem instanceof Component) || (vDomItem instanceof ElementComponent)) {
                vDomItem.notifyBeforeDetachFromDom();
            }
        });
    }
    detachFromDom() {
        this._children.forEach((vDomItem) => {
            vDomItem.detachFromDom();
        });
        this._firstNode.parentNode.removeChild(this._firstNode);
        this._lastNode.parentNode.removeChild(this._lastNode);
    }
    bindSupplier(supplier) {
        return new ComponentBoundedSupplier(this, supplier);
    }
}
class ComponentBoundedSupplier {
    constructor(component, supplier) {
        this._component = component;
        this._supplier = supplier;
        this._subscribers = [];
        component.beforeDetachFromDom.subscribe(supplier.subscribe(new SubscriberImpl(this)));
    }
    _() {
        return this._supplier._.apply(this._supplier, arguments);
    }
    _emit(value) {
        const callSubscribers = new CallSubscribers(this);
        callSubscribers._.apply(callSubscribers, arguments);
    }
    subscribe(subscriber) {
        this._subscribers.push(subscriber);
        return new UnsubscriberImpl(this, subscriber);
    }
}
class SubscriberImpl {
    constructor(componentBoundedSupplier) {
        this._componentBoundedSupplier = componentBoundedSupplier;
    }
    _(value) {
        this._componentBoundedSupplier._emit(value);
    }
}
