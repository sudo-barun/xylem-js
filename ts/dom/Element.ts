import applyNativeComponentMixin from "./_internal/applyNativeComponentMixin.js";
import combineNamedStores from "../core/combineNamedStores.js";
import Component from "./Component.js";
import ComponentItem from "../types/ComponentItem.js";
import ComponentModifier from "../types/ComponentModifier.js";
import createAttributeFunction from "./createAttributeFunction.js";
import map from "../core/map.js";
import NativeComponent from "../types/_internal/NativeComponent.js";
import setAttribute from "./setAttribute.js";
import Store from "../types/Store.js";
import Subscriber from "../types/Subscriber.js";

export default
class Element
{
	declare tagName: string;
	declare attributes: { [key:string]: any };
	declare children: ComponentItem[];
	declare _isSelfClosing: boolean;
	declare listeners: { [key:string]: ()=>{} };
	declare elementStoreSubscriber?: Subscriber<HTMLElement>;

	declare _domNode: HTMLElement;
	declare _virtualDom: Array<ComponentItem>;

	constructor(
		tagName: string,
		attributes = {},
		children = []
	) {
		this.tagName = tagName;
		this.attributes = attributes;
		this.children = children;
		this._isSelfClosing = false;
		this.listeners = {};
		this._virtualDom = children;
		this._domNode = undefined!;
		this.elementStoreSubscriber = undefined;
	}

	isSelfClosing(isSelfClosing?: boolean): boolean
	{
		if (arguments.length !== 0) {
			this._isSelfClosing = isSelfClosing!;
		}
		return this._isSelfClosing;
	}

	setup(modifier?: ComponentModifier): void
	{
		this.children.forEach(virtualNode => {
			if ((virtualNode instanceof Component) || (virtualNode instanceof Element)) {
				virtualNode.setup(modifier);
			}
		});
	}

	createDomNode(): globalThis.HTMLElement
	{
		return document.createElement(this.tagName);
	}

	setupDom()
	{
		const nodeExists = !!this._domNode;
		const element = this._domNode = this._domNode || this.createDomNode();
		if (this.elementStoreSubscriber) {
			this.elementStoreSubscriber(element);
		}

		Object.keys(this.attributes).forEach((attr) => {
			if (attr === '()') {
				this.attributes[attr](element, attr);
			} else if (typeof this.attributes[attr] === 'function') {
				createAttributeFunction(this.attributes[attr])(element, attr);
			} else if (attr === 'class' && typeof this.attributes[attr] === 'object') {
				createAttributeFunction(attrClass(this.attributes[attr]))(element, attr);
			} else if (attr === 'style' && typeof this.attributes[attr] === 'object') {
				createAttributeFunction(attrStyle(this.attributes[attr]))(element, attr);
			} else {
				setAttribute(element, attr, this.attributes[attr]);
			}
		});

		Object.keys(this.listeners).forEach((event) => {
			element.addEventListener(event, this.listeners[event]);
		});

		this.children.forEach(node => node.setupDom());
		if (! nodeExists) {
			this.getChildNodes().forEach((node) => {
				element.appendChild(node);
			});
		}
	}

	getChildNodes(): ChildNode[]
	{
		return this.children.map(c => c.getDomNodes())
		.reduce((acc, item) => {
			acc.push(...item);
			return acc;
		}, [] as ChildNode[]);
	}

	notifyAfterAttachToDom()
	{
		this._virtualDom.forEach((vDomItem) => {
			if ((vDomItem instanceof Component) || (vDomItem instanceof Element)) {
				vDomItem.notifyAfterAttachToDom();
			}
		});
	}

	notifyBeforeDetachFromDom()
	{
		this._virtualDom.forEach((vDomItem) => {
			if ((vDomItem instanceof Component) || (vDomItem instanceof Element)) {
				vDomItem.notifyBeforeDetachFromDom();
			}
		});
	}
}

export default
interface Element extends NativeComponent {}

applyNativeComponentMixin(Element);

type StyleDefinitions = {
	[cssProperty: string]: Store<string>,
};

function attrStyle(styleDefinitions: StyleDefinitions|[string, StyleDefinitions]): Store<string>
{
	if (styleDefinitions instanceof Array) {
		return map(attrStyle(styleDefinitions[1]), (v) => {
			if (v) {
				return [styleDefinitions[0], v].join(' ');
			} else {
				return styleDefinitions[0];
			}
		});
	} else {
		return map(combineNamedStores(styleDefinitions), (v) => {
			return Object.keys(v).reduce((acc, cssProperty) => {
				acc.push(`${cssProperty}:${styleDefinitions[cssProperty]}`);
				return acc;
			}, [] as string[]).join('; ');
		});
	}
}

type ClassDefinitions = {
	[className: string]: Store<boolean>,
};

function attrClass(classDefinitions: ClassDefinitions|[string, ClassDefinitions]): Store<string>
{
	if (classDefinitions instanceof Array) {
		return map(attrClass(classDefinitions[1]), (v) => {
			if (v) {
				return [classDefinitions[0], v].join(' ');
			} else {
				return classDefinitions[0];
			}
		});
	} else {
		return map(combineNamedStores(classDefinitions), (v) => {
			return Object.keys(v).reduce((acc, className) => {
				if (v[className]) {
					acc.push(className);
				}
				return acc;
			}, [] as string[]).join(' ');
		});
	}
}
