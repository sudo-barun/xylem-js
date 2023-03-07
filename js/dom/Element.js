import combineNamedStores from "../core/combineNamedStores.js";
import Component from "./Component.js";
import createAttributeFunction from "./createAttributeFunction.js";
import map from "../core/map.js";
import NativeComponent from "./NativeComponent.js";
import setAttribute from "./setAttribute.js";
import Text from "./Text.js";
export default class Element extends NativeComponent {
    tagName;
    attributes;
    children;
    listeners;
    elementStoreSubscriber;
    _domNode;
    _virtualDom;
    constructor(tagName, attributes = {}, children = []) {
        super();
        this.tagName = tagName;
        this.attributes = attributes;
        this.children = children;
        this.listeners = {};
        this._virtualDom = children;
    }
    setup(modifier) {
        this.children.forEach(virtualNode => {
            if ((virtualNode instanceof Component) || (virtualNode instanceof Element)) {
                virtualNode.setup(modifier);
            }
        });
    }
    createDomNode() {
        return document.createElement(this.tagName);
    }
    setupDom() {
        const element = this._domNode = this._domNode ?? this.createDomNode();
        this.elementStoreSubscriber?.(element);
        Object.keys(this.attributes).forEach((attr) => {
            if (attr === '()') {
                this.attributes[attr](element, attr);
            }
            else if (typeof this.attributes[attr] === 'function') {
                createAttributeFunction(this.attributes[attr])(element, attr);
            }
            else if (attr === 'class' && typeof this.attributes[attr] === 'object') {
                createAttributeFunction(attrClass(this.attributes[attr]))(element, attr);
            }
            else if (attr === 'style' && typeof this.attributes[attr] === 'object') {
                createAttributeFunction(attrStyle(this.attributes[attr]))(element, attr);
            }
            else {
                setAttribute(element, attr, this.attributes[attr]);
            }
        });
        Object.keys(this.listeners).forEach((event) => {
            element.addEventListener(event, this.listeners[event]);
        });
        if (element.childNodes.length) {
            if (this.children.length > 1) {
                throw new Error('Currently not supported');
            }
            this.children.forEach(c => {
                if (c instanceof Text) {
                    const childNode = element.childNodes[0];
                    if (!(childNode instanceof globalThis.Text)) {
                        throw new Error('Currently not supported');
                    }
                    c.setDomNode(childNode);
                    const textContent = c.getTextContentAsString();
                    if (textContent !== c.getDomNode().textContent) {
                        console.warn('text content was not found to be in sync for element: ', element);
                        console.warn('text content of Text DOM node: ', c.getDomNode().textContent);
                        console.warn('text content of Text object: ', textContent);
                    }
                    c.getDomNode().textContent = c.getTextContentAsString();
                    c.setupSubscribers();
                }
                else {
                    throw new Error('Currently not supported');
                }
            });
        }
        else {
            this.children.forEach(node => node.setupDom());
            // element.append(...this.children.map(c => {
            // 	if (c instanceof Component) {
            // 		return c.getDomNodes();
            // 	} else {
            // 		return c.getDomNode();
            // 	}
            // }).flat());
            this.children.map(c => {
                if (c instanceof Component) {
                    return c.getDomNodes();
                }
                else {
                    return c.getDomNode();
                }
            }).flat().forEach((node) => {
                element.appendChild(node);
            });
        }
    }
    setDomNode(domNode) {
        this._domNode = domNode;
    }
    getDomNode() {
        return this._domNode;
    }
    notifyAfterAttachToDom() {
        this._virtualDom.forEach((vDomItem) => {
            if ((vDomItem instanceof Component) || (vDomItem instanceof Element)) {
                vDomItem.notifyAfterAttachToDom();
            }
        });
    }
    notifyBeforeDetachFromDom() {
        this._virtualDom.forEach((vDomItem) => {
            if ((vDomItem instanceof Component) || (vDomItem instanceof Element)) {
                vDomItem.notifyBeforeDetachFromDom();
            }
        });
    }
    detachFromDom() {
        this._domNode.parentNode.removeChild(this._domNode);
    }
}
function attrStyle(styleDefinitions) {
    if (styleDefinitions instanceof Array) {
        return map(attrStyle(styleDefinitions[1]), (v) => {
            if (v) {
                return [styleDefinitions[0], v].join(' ');
            }
            else {
                return styleDefinitions[0];
            }
        });
    }
    else {
        return map(combineNamedStores(styleDefinitions), (v) => {
            return Object.keys(v).reduce((acc, cssProperty) => {
                acc.push(`${cssProperty}:${styleDefinitions[cssProperty]}`);
                return acc;
            }, []).join('; ');
        });
    }
}
function attrClass(classDefinitions) {
    if (classDefinitions instanceof Array) {
        return map(attrClass(classDefinitions[1]), (v) => {
            if (v) {
                return [classDefinitions[0], v].join(' ');
            }
            else {
                return classDefinitions[0];
            }
        });
    }
    else {
        return map(combineNamedStores(classDefinitions), (v) => {
            return Object.keys(v).reduce((acc, className) => {
                if (v[className]) {
                    acc.push(className);
                }
                return acc;
            }, []).join(' ');
        });
    }
}
