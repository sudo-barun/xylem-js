import Component from "./Component.js";
import createAttributeFunction from "./createAttributeFunction.js";
import createFunctionToSetClassList from "./createFunctionToSetClassList.js";
import setAttribute from "./setAttribute.js";
import styleAttr from "./styleAttr.js";
import Text from "./Text.js";
import NativeComponent from "./NativeComponent.js";
export default class Element extends NativeComponent {
    tagName;
    attributes;
    children;
    classes;
    listeners;
    elementStoreSubscriber;
    _domNode;
    _virtualDom;
    constructor(tagName, attributes = {}, children = []) {
        super();
        this.tagName = tagName;
        this.attributes = attributes;
        this.children = children;
        this.classes = {};
        this.listeners = {};
        this._virtualDom = children;
    }
    setup() {
        this.children.forEach(node => {
            if ((node instanceof Component) || (node instanceof Element)) {
                return node.setup();
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
            else if (attr === 'style' && this.attributes[attr] instanceof Object) {
                createAttributeFunction(styleAttr(this.attributes[attr]))(element, attr);
            }
            else {
                setAttribute(element, attr, this.attributes[attr]);
            }
        });
        createFunctionToSetClassList(this.classes)(element);
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
