import createEmittableStream from "../core/createEmittableStream.js";
import ElementComponent from "./_internal/ElementComponent.js";
import { defaultContext } from "./context.js";
export default class Component {
    constructor(attributes = {}) {
        this._attributes = attributes;
        this._notifyAfterSetup = createEmittableStream();
        this.afterSetup = this._notifyAfterSetup.subscribeOnly;
        this._notifyAfterAttach = createEmittableStream();
        this.afterAttach = this._notifyAfterAttach.subscribeOnly;
        this._notifyBeforeDetach = createEmittableStream();
        this.beforeDetach = this._notifyBeforeDetach.subscribeOnly;
        this._modifier = undefined;
        this._children = undefined;
        this._firstNode = undefined;
        this._lastNode = undefined;
        this._parentComponent = null;
    }
    injectAttributes(attributes) {
        this._attributes = { ...attributes, ...this._attributes };
    }
    setParentComponent(parentComponent) {
        this._parentComponent = parentComponent;
    }
    getParentComponent() {
        return this._parentComponent;
    }
    setNamespace(namespace) {
        this._namespace = namespace;
    }
    getNamespace() {
        return this._namespace;
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
        if (this._context === undefined) {
            this._context = defaultContext;
        }
        const children = this.build(this._attributes);
        for (const _vDom of children) {
            if ((_vDom instanceof Component)) {
                _vDom.setParentComponent(this);
                _vDom.setContext(this._context);
                if (this._namespace !== undefined) {
                    _vDom.setNamespace(this._namespace);
                }
                _vDom.setup(modifier);
            }
            else if (_vDom instanceof ElementComponent) {
                _vDom.setup(this, this._namespace, modifier, this._context);
            }
        }
        this._children = children;
    }
    reload() {
        this.notifyBeforeDetach();
        for (const vDomItem of this._children) {
            vDomItem.detach();
        }
        this._notifyAfterSetup = createEmittableStream();
        this.afterSetup = this._notifyAfterSetup.subscribeOnly;
        this._notifyAfterAttach = createEmittableStream();
        this.afterAttach = this._notifyAfterAttach.subscribeOnly;
        this._notifyBeforeDetach = createEmittableStream();
        this.beforeDetach = this._notifyBeforeDetach.subscribeOnly;
        this.setup(this._modifier);
        this.notifyAfterSetup();
        for (const vDom of this._children) {
            vDom.setupDom();
        }
        for (const node of this.childNodes()) {
            this._lastNode.parentNode.insertBefore(node, this._lastNode);
        }
        this.notifyAfterAttach();
    }
    getComponentName() {
        const componentName = Object.getPrototypeOf(this).constructor.name;
        return typeof componentName === 'string' ? componentName : '';
    }
    setupDom() {
        const isDebug = this.getContext().getItem('$$DEBUG', false);
        const name = this.getComponentName();
        this._firstNode = this._firstNode || document.createComment(isDebug ? name : '');
        this._lastNode = this._lastNode || document.createComment(isDebug ? '/' + name : '');
        for (const vDom of this._children) {
            vDom.setupDom();
        }
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
    notifyAfterSetup() {
        this._notifyAfterSetup._();
        for (const vDomItem of this._children) {
            if ((vDomItem instanceof Component) || (vDomItem instanceof ElementComponent)) {
                vDomItem.notifyAfterSetup();
            }
        }
    }
    notifyAfterAttach() {
        this._notifyAfterAttach._();
        for (const vDomItem of this._children) {
            if ((vDomItem instanceof Component) || (vDomItem instanceof ElementComponent)) {
                vDomItem.notifyAfterAttach();
            }
        }
    }
    notifyBeforeDetach() {
        this._notifyBeforeDetach._();
        for (const vDomItem of this._children) {
            vDomItem.notifyBeforeDetach();
        }
    }
    detach() {
        for (const vDomItem of this._children) {
            vDomItem.detach();
        }
        this._firstNode.parentNode.removeChild(this._firstNode);
        this._lastNode.parentNode.removeChild(this._lastNode);
    }
    setContext(parentContext) {
        this._context = 'createContext' in this ? this.createContext(parentContext) : parentContext;
        return this;
    }
    getContext() {
        return this._context;
    }
}
