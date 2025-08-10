import applyNativeComponentMixin from "./applyNativeComponentMixin.js";
import combineNamedSuppliers from "../../core/combineNamedSuppliers.js";
import combineSuppliers from "../../core/combineSuppliers.js";
import Component from "../Component.js";
import createStore from "../../core/createStore.js";
import isSupplier from "../../utilities/isSupplier.js";
import map from "../../core/map.js";
import createEmittableStream from "../../core/createEmittableStream.js";
export default class ElementComponent {
    constructor(tagName, attributes = {}, children = []) {
        this._tagName = tagName;
        this._attributes = attributes;
        this._children = children;
        this._listeners = {};
        this._elementSubscriber = null;
        this._domNode = undefined;
        this._notifyBeforeDetachFromDom = createEmittableStream();
        this.beforeDetachFromDom = this._notifyBeforeDetachFromDom.subscribeOnly;
    }
    tagName() {
        return this._tagName;
    }
    attributes() {
        return this._attributes;
    }
    getNamespace() {
        return this._namespace ?? 'html';
    }
    children() {
        return this._children;
    }
    listeners() {
        return this._listeners;
    }
    addListener(eventName, listener) {
        this._listeners[eventName] = listener;
    }
    elementSubscriber(subscriber) {
        if (arguments.length !== 0) {
            this._elementSubscriber = subscriber;
        }
        return this._elementSubscriber;
    }
    setup(parentComponent, namespace, modifier) {
        if (this._tagName === 'svg') {
            this._namespace = 'svg';
        }
        else if (this._tagName === 'math') {
            this._namespace = 'mathml';
        }
        else {
            if (namespace !== undefined) {
                this._namespace = namespace;
            }
        }
        for (const child of this._children) {
            if ((child instanceof Component)) {
                child.setParentComponent(parentComponent);
                if (this._namespace !== undefined) {
                    child.setNamespace(this._namespace);
                }
                child.setup(modifier);
            }
            else if (child instanceof ElementComponent) {
                child.setup(parentComponent, this._namespace, modifier);
            }
        }
    }
    createDomNode() {
        if (this._namespace === undefined) {
            return document.createElement(this._tagName, { is: this._attributes.is });
        }
        else if (this._namespace === 'svg') {
            return document.createElementNS('http://www.w3.org/2000/svg', this._tagName, { is: this._attributes.is });
        }
        else if (this._namespace === 'mathml') {
            return document.createElementNS('http://www.w3.org/1998/Math/MathML', this._tagName, { is: this._attributes.is });
        }
        else {
            throw new Error(`Unsupported namespace "${this._namespace}" encountered`);
        }
    }
    setupDom() {
        const isNewNode = !this._domNode;
        const element = this._domNode = this._domNode || this.createDomNode();
        for (const attr of Object.keys(this._attributes)) {
            if (attr === '()') {
                this._attributes[attr](element, attr);
            }
            else if (isSupplier(this._attributes[attr])) {
                createAttributeFunction(this, this._attributes[attr])(element, attr, isNewNode);
            }
            else if (attr === 'class' && typeof this._attributes[attr] === 'object' && this._attributes[attr] !== null) {
                createAttributeFunction(this, attrClass(this, this._attributes[attr]))(element, attr, isNewNode);
            }
            else if (attr === 'style' && typeof this._attributes[attr] === 'object' && this._attributes[attr] !== null) {
                createAttributeFunction(this, attrStyle(this, this._attributes[attr]))(element, attr, isNewNode);
            }
            else {
                if (isNewNode) {
                    setAttribute(element, attr, this._attributes[attr]);
                }
            }
        }
        for (const event of Object.keys(this._listeners)) {
            const listener = this._listeners[event];
            if (listener instanceof Array) {
                element.addEventListener(event, listener[0], listener[1]);
            }
            else {
                element.addEventListener(event, listener);
            }
        }
        for (const node of this._children) {
            node.setupDom();
        }
        if (isNewNode) {
            for (const node of this.getChildNodes()) {
                element.appendChild(node);
            }
        }
        if (this._elementSubscriber) {
            if (typeof this._elementSubscriber === 'function') {
                this._elementSubscriber(element);
            }
            else {
                this._elementSubscriber._(element);
            }
        }
    }
    getChildNodes() {
        return this._children.map(c => c.domNodes())
            .reduce((acc, item) => {
            acc.push(...item);
            return acc;
        }, []);
    }
    notifyAfterSetup() {
        for (const vDomItem of this._children) {
            if ((vDomItem instanceof Component) || (vDomItem instanceof ElementComponent)) {
                vDomItem.notifyAfterSetup();
            }
        }
    }
    notifyAfterAttachToDom() {
        for (const vDomItem of this._children) {
            if ((vDomItem instanceof Component) || (vDomItem instanceof ElementComponent)) {
                vDomItem.notifyAfterAttachToDom();
            }
        }
    }
    notifyBeforeDetachFromDom() {
        this._notifyBeforeDetachFromDom._();
        for (const vDomItem of this._children) {
            vDomItem.notifyBeforeDetachFromDom();
        }
    }
}
applyNativeComponentMixin(ElementComponent);
function styleObjectToStringMapper(namedStyles) {
    const mappedStyles = Object.keys(namedStyles)
        .map((propName) => [propName, namedStyles[propName]])
        .filter(([, propVal]) => propVal !== '' && propVal !== false && propVal !== null && propVal !== undefined)
        .map((prop) => prop.join(': '));
    return mappedStyles.length === 0 ? false : mappedStyles.join('; ');
}
function styleArrayToStringMapper(styles) {
    let mappedStyles = styles.filter(propVal => propVal !== false && propVal !== null && propVal !== undefined);
    if (mappedStyles.length > 1) {
        mappedStyles = mappedStyles.filter(class_ => class_ !== '');
        if (mappedStyles.length === 0) {
            mappedStyles = [''];
        }
    }
    return mappedStyles.length === 0 ? false : mappedStyles.join('; ');
}
export function attrStyle(hasLifecycle, styleDefinitions) {
    if (styleDefinitions instanceof Array) {
        return map(hasLifecycle, combineSuppliers(hasLifecycle, styleDefinitions.map(styleDefn => {
            if (isSupplier(styleDefn)) {
                return styleDefn;
            }
            if (typeof styleDefn === 'object' && styleDefn !== null) {
                const namedSuppliers = {};
                for (const name in styleDefn) {
                    const propValue = styleDefn[name];
                    namedSuppliers[name] = isSupplier(propValue)
                        ? propValue
                        : createStore(propValue);
                }
                return map(hasLifecycle, combineNamedSuppliers(hasLifecycle, namedSuppliers), styleObjectToStringMapper);
            }
            return createStore(styleDefn);
        })), styleArrayToStringMapper);
    }
    else {
        return attrStyle(hasLifecycle, [styleDefinitions]);
    }
}
function classObjectToStringMapper(namedClasses) {
    const mappedClasses = Object
        .keys(namedClasses)
        .map((class_) => [class_, namedClasses[class_]])
        .filter(([, classVal]) => classVal)
        .map(([class_]) => class_);
    return mappedClasses.length === 0 ? false : mappedClasses.join(' ');
}
function classArrayToStringMapper(classes) {
    let mappedClasses = classes.filter(class_ => class_ !== false && class_ !== null && class_ !== undefined);
    if (mappedClasses.length > 1) {
        mappedClasses = mappedClasses.filter(class_ => class_ !== '');
        if (mappedClasses.length === 0) {
            mappedClasses = [''];
        }
    }
    return mappedClasses.length === 0 ? false : mappedClasses.join(' ');
}
export function attrClass(hasLifecycle, classDefinitions) {
    if (classDefinitions instanceof Array) {
        return map(hasLifecycle, combineSuppliers(hasLifecycle, classDefinitions.map(classDefn => {
            if (isSupplier(classDefn)) {
                return classDefn;
            }
            if (typeof classDefn === 'object' && classDefn !== null) {
                const namedSuppliers = {};
                for (const name in classDefn) {
                    const propValue = classDefn[name];
                    namedSuppliers[name] = isSupplier(propValue)
                        ? propValue
                        : createStore(propValue);
                }
                return map(hasLifecycle, combineNamedSuppliers(hasLifecycle, namedSuppliers), classObjectToStringMapper);
            }
            return createStore(classDefn);
        })), classArrayToStringMapper);
    }
    else {
        return attrClass(hasLifecycle, [classDefinitions]);
    }
}
class AttributeSubscriber {
    constructor(element, attributeName) {
        this._element = element;
        this._attributeName = attributeName;
    }
    _(value) {
        setAttribute(this._element, this._attributeName, value);
    }
}
function createAttributeFunction(hasLifecycle, supplier) {
    return function (element, attributeName, isNewNode) {
        if (isNewNode) {
            setAttribute(element, attributeName, supplier._());
        }
        hasLifecycle.beforeDetachFromDom.subscribe(supplier.subscribe(new AttributeSubscriber(element, attributeName)));
    };
}
function setAttribute(element, name, value) {
    if (value === true) {
        element.setAttribute(name, '');
    }
    else if ([undefined, null, false].indexOf(value) !== -1) {
        element.removeAttribute(name);
    }
    else {
        element.setAttribute(name, value);
    }
}
