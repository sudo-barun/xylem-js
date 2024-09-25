import applyNativeComponentMixin from "./applyNativeComponentMixin.js";
import combineNamedSuppliers from "../../core/combineNamedSuppliers.js";
import combineSuppliers from "../../core/combineSuppliers.js";
import Component from "../Component.js";
import createStore from "../../core/createStore.js";
import isSupplier from "../../utilities/isSupplier.js";
import map from "../../core/map.js";
export default class ElementComponent {
    constructor(tagName, attributes = {}, children = []) {
        this._tagName = tagName;
        this._attributes = attributes;
        this._children = children;
        this._listeners = {};
        this._elementSubscriber = null;
        this._isSelfClosing = false;
        this._domNode = undefined;
    }
    tagName() {
        return this._tagName;
    }
    attributes() {
        return this._attributes;
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
    isSelfClosing(isSelfClosing) {
        if (arguments.length !== 0) {
            this._isSelfClosing = isSelfClosing;
        }
        return this._isSelfClosing;
    }
    setup(parentComponent, modifier) {
        for (const child of this._children) {
            if ((child instanceof Component)) {
                child.setParentComponent(parentComponent);
                child.setup(modifier);
            }
            else if (child instanceof ElementComponent) {
                child.setup(parentComponent, modifier);
            }
        }
    }
    createDomNode() {
        return document.createElement(this._tagName);
    }
    setupDom() {
        const nodeExists = !!this._domNode;
        const element = this._domNode = this._domNode || this.createDomNode();
        if (this._elementSubscriber) {
            if (typeof this._elementSubscriber === 'function') {
                this._elementSubscriber(element);
            }
            else {
                this._elementSubscriber._(element);
            }
        }
        for (const attr of Object.keys(this._attributes)) {
            if (attr === '()') {
                this._attributes[attr](element, attr);
            }
            else if (isSupplier(this._attributes[attr])) {
                createAttributeFunction(this._attributes[attr])(element, attr);
            }
            else if (attr === 'class' && typeof this._attributes[attr] === 'object' && this._attributes[attr] !== null) {
                createAttributeFunction(attrClass(this._attributes[attr]))(element, attr);
            }
            else if (attr === 'style' && typeof this._attributes[attr] === 'object' && this._attributes[attr] !== null) {
                createAttributeFunction(attrStyle(this._attributes[attr]))(element, attr);
            }
            else {
                setAttribute(element, attr, this._attributes[attr]);
            }
        }
        for (const event of Object.keys(this._listeners)) {
            element.addEventListener(event, this._listeners[event]);
        }
        for (const node of this._children) {
            node.setupDom();
        }
        if (!nodeExists) {
            for (const node of this.getChildNodes()) {
                element.appendChild(node);
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
        for (const vDomItem of this._children) {
            if ((vDomItem instanceof Component) || (vDomItem instanceof ElementComponent)) {
                vDomItem.notifyBeforeDetachFromDom();
            }
        }
    }
}
applyNativeComponentMixin(ElementComponent);
function styleObjectToStringMapper(namedStyles) {
    const mappedStyles = Object.entries(namedStyles)
        .filter(([, propVal]) => propVal !== false)
        .map((prop) => prop.join(': '));
    return mappedStyles.length === 0 ? false : mappedStyles.join('; ');
}
function styleArrayToStringMapper(styles) {
    const mappedStyles = styles.filter(propVal => propVal !== false);
    return mappedStyles.length === 0 ? false : mappedStyles.join('; ');
}
function attrStyle(styleDefinitions) {
    if (styleDefinitions instanceof Array) {
        return map(combineSuppliers(styleDefinitions.map(styleDefn => {
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
                return map(combineNamedSuppliers(namedSuppliers), styleObjectToStringMapper);
            }
            return createStore(styleDefn);
        })), styleArrayToStringMapper);
    }
    else {
        return attrStyle([styleDefinitions]);
    }
}
function classObjectToStringMapper(namedClasses) {
    const mappedClasses = Object
        .entries(namedClasses)
        .filter(([, classVal]) => classVal !== false)
        .map(([class_]) => class_);
    return mappedClasses.length === 0 ? false : mappedClasses.join(' ');
}
function classArrayToStringMapper(classes) {
    const mappedClasses = classes.filter(class_ => class_ !== false);
    return mappedClasses.length === 0 ? false : mappedClasses.join(' ');
}
function attrClass(classDefinitions) {
    if (classDefinitions instanceof Array) {
        return map(combineSuppliers(classDefinitions.map(classDefn => {
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
                return map(combineNamedSuppliers(namedSuppliers), classObjectToStringMapper);
            }
            return createStore(classDefn);
        })), classArrayToStringMapper);
    }
    else {
        return attrClass([classDefinitions]);
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
function createAttributeFunction(supplier) {
    return function (element, attributeName) {
        setAttribute(element, attributeName, supplier._());
        supplier.subscribe(new AttributeSubscriber(element, attributeName));
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
