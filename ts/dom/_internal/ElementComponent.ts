import applyNativeComponentMixin from "./applyNativeComponentMixin.js";
import combineNamedSuppliers from "../../core/combineNamedSuppliers.js";
import Component from "../Component.js";
import ComponentChildren from "../../types/ComponentChildren.js";
import ComponentModifier from "../../types/ComponentModifier.js";
import Supplier from "../../types/Supplier.js";
import isSupplier from "../../utilities/isSupplier.js";
import map from "../../core/map.js";
import NativeComponent from "../../types/_internal/NativeComponent.js";
import Subscriber from "../../types/Subscriber.js";
import SubscriberObject from "../../types/SubscriberObject.js";

export default
class ElementComponent
{
	declare _tagName: string;
	declare _attributes: { [key:string]: any };
	declare _children: ComponentChildren;
	declare _listeners: { [key:string]: EventListenerOrEventListenerObject };
	declare _elementSubscriber: Subscriber<HTMLElement>|null;
	declare _isSelfClosing: boolean;
	declare _domNode: HTMLElement;

	constructor(
		tagName: string,
		attributes = {},
		children = []
	) {
		this._tagName = tagName;
		this._attributes = attributes;
		this._children = children;
		this._listeners = {};
		this._elementSubscriber = null;
		this._isSelfClosing = false;
		this._domNode = undefined!;
	}

	tagName(): string
	{
		return this._tagName;
	}

	attributes(): { [key:string]: any }
	{
		return this._attributes;
	}

	children(): ComponentChildren
	{
		return this._children;
	}

	listeners(): { [key:string]: EventListenerOrEventListenerObject }
	{
		return this._listeners;
	}

	addListener(eventName: string, listener: EventListenerOrEventListenerObject)
	{
		this._listeners[eventName] = listener;
	}

	elementSubscriber(subscriber?: Subscriber<HTMLElement>|null): Subscriber<HTMLElement>|null
	{
		if (arguments.length !== 0) {
			this._elementSubscriber = subscriber!;
		}
		return this._elementSubscriber;
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
		this._children.forEach(child => {
			if ((child instanceof Component) || (child instanceof ElementComponent)) {
				child.setup(modifier);
			}
		});
	}

	createDomNode(): HTMLElement
	{
		return document.createElement(this._tagName);
	}

	setupDom(): void
	{
		const nodeExists = !!this._domNode;
		const element = this._domNode = this._domNode || this.createDomNode();
		if (this._elementSubscriber) {
			if (typeof this._elementSubscriber === 'function') {
				this._elementSubscriber(element);
			} else {
				this._elementSubscriber._(element);
			}
		}

		Object.keys(this._attributes).forEach((attr) => {
			if (attr === '()') {
				this._attributes[attr](element, attr);
			} else if (isSupplier(this._attributes[attr])) {
				createAttributeFunction(this._attributes[attr])(element, attr);
			} else if (attr === 'class' && typeof this._attributes[attr] === 'object') {
				createAttributeFunction(attrClass(this._attributes[attr]))(element, attr);
			} else if (attr === 'style' && typeof this._attributes[attr] === 'object') {
				createAttributeFunction(attrStyle(this._attributes[attr]))(element, attr);
			} else {
				setAttribute(element, attr, this._attributes[attr]);
			}
		});

		Object.keys(this._listeners).forEach((event) => {
			element.addEventListener(event, this._listeners[event]);
		});

		this._children.forEach(node => node.setupDom());
		if (! nodeExists) {
			this.getChildNodes().forEach((node) => {
				element.appendChild(node);
			});
		}
	}

	getChildNodes(): ChildNode[]
	{
		return this._children.map(c => c.domNodes())
		.reduce((acc, item) => {
			acc.push(...item);
			return acc;
		}, [] as ChildNode[]);
	}

	notifyAfterAttachToDom(): void
	{
		this._children.forEach((vDomItem) => {
			if ((vDomItem instanceof Component) || (vDomItem instanceof ElementComponent)) {
				vDomItem.notifyAfterAttachToDom();
			}
		});
	}

	notifyBeforeDetachFromDom(): void
	{
		this._children.forEach((vDomItem) => {
			if ((vDomItem instanceof Component) || (vDomItem instanceof ElementComponent)) {
				vDomItem.notifyBeforeDetachFromDom();
			}
		});
	}
}

export default
interface ElementComponent extends NativeComponent {}

applyNativeComponentMixin(ElementComponent);

type StyleDefinitions = {
	[cssProperty: string]: Supplier<string>,
};

class CombineStyleStringAndArray
{
	declare _classDefinition: string;

	constructor(classDefinition: string)
	{
		this._classDefinition = classDefinition;
	}

	_(v: string): string
	{
		if (v) {
			return [this._classDefinition, v].join(' ');
		} else {
			return this._classDefinition;
		}
	}
}

function stringObjectToStringMapper(v: { [prop: string]: any })
{
	return Object.keys(v).reduce((acc, cssProperty) => {
		acc.push(`${cssProperty}: ${v[cssProperty]}`);
		return acc;
	}, [] as string[]).join('; ');
}

function attrStyle(styleDefinitions: StyleDefinitions|[string, StyleDefinitions]): Supplier<string>
{
	if (styleDefinitions instanceof Array) {
		return map(attrStyle(styleDefinitions[1]), new CombineStyleStringAndArray(styleDefinitions[0]));
	} else {
		return map(combineNamedSuppliers(styleDefinitions), stringObjectToStringMapper);
	}
}

type ClassDefinitions = {
	[className: string]: Supplier<boolean>,
};

function classObjectToStringMapper(v: { [prop: string]: any }): string
{
	return Object.keys(v).reduce((acc, className) => {
		if (v[className]) {
			acc.push(className);
		}
		return acc;
	}, [] as string[]).join(' ');
}

class CombineClassStringAndArray
{
	declare _classDefinition: string;

	constructor(classDefinition: string)
	{
		this._classDefinition = classDefinition;
	}

	_(v: string): string
	{
		if (v) {
			return [this._classDefinition, v].join(' ');
		} else {
			return this._classDefinition;
		}
	}
}

function attrClass(classDefinitions: ClassDefinitions|[string, ClassDefinitions]): Supplier<string>
{
	if (classDefinitions instanceof Array) {
		return map(attrClass(classDefinitions[1]), new CombineClassStringAndArray(classDefinitions[0]));
	} else {
		return map(combineNamedSuppliers(classDefinitions), classObjectToStringMapper);
	}
}

type Attribute = string|boolean|null|undefined;

class AttributeSubscriber implements SubscriberObject<Attribute>
{
	declare _element: HTMLElement;
	declare _attributeName: string;

	constructor(element: HTMLElement, attributeName: string)
	{
		this._element = element;
		this._attributeName = attributeName;
	}

	_(value: Attribute): void
	{
		setAttribute(this._element, this._attributeName, value);
	}
}

function createAttributeFunction(supplier: Supplier<Attribute>)
{
	return function (
		element: HTMLElement,
		attributeName: string,
	): void {
		setAttribute(element, attributeName, supplier._());
		supplier.subscribe(new AttributeSubscriber(element, attributeName));
	};
}

function setAttribute(element: HTMLElement, name: string, value: Attribute)
{
	if (value === true) {
		element.setAttribute(name, '');
	} else if (([ undefined, null, false ] as any[]).indexOf(value) !== -1) {
		element.removeAttribute(name);
	} else {
		element.setAttribute(name, <string> value);
	}
}
