import createEmittableStream from "../core/createEmittableStream.js";
import ElementComponent from "./_internal/ElementComponent.js";
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
        this._notifyAfterAttachToDom();
        this._children.forEach((vDomItem) => {
            if ((vDomItem instanceof Component) || (vDomItem instanceof ElementComponent)) {
                vDomItem.notifyAfterAttachToDom();
            }
        });
    }
    notifyBeforeDetachFromDom() {
        this._notifyBeforeDetachFromDom();
        this._children.forEach((vDomItem) => {
            if ((vDomItem instanceof Component) || (vDomItem instanceof ElementComponent)) {
                vDomItem.notifyBeforeDetachFromDom();
            }
        });
    }
    detachFromDom() {
        this._children.forEach((vDomItem) => {
            vDomItem.detachFromDom();
            this._firstNode.parentNode.removeChild(this._firstNode);
            this._lastNode.parentNode.removeChild(this._lastNode);
        });
    }
    bindDataNode(dataNode) {
        const subscribers = [];
        const boundedDataNode = function () {
            return dataNode.apply(null, arguments);
        };
        this.beforeDetachFromDom.subscribe(dataNode.subscribe((value) => {
            subscribers.forEach(subscriber => subscriber(value));
        }));
        const removeSubscriber = function (subscriber) {
            const index = subscribers.indexOf(subscriber);
            if (index === -1) {
                throw new Error('Subscriber already removed from the list of subscribers');
            }
            subscribers.splice(index, 1);
        };
        const subscribe = function (subscriber) {
            subscribers.push(subscriber);
            return function () {
                removeSubscriber(subscriber);
            };
        };
        boundedDataNode.subscribe = subscribe;
        Object.defineProperty(boundedDataNode, 'subscribe', { value: subscribe });
        Object.defineProperty(boundedDataNode, '_source', { value: dataNode });
        return boundedDataNode;
    }
}
