import applyNativeComponentMixin from "./applyNativeComponentMixin.js";
import combineNamedSuppliers from "../../core/combineNamedSuppliers.js";
import combineSuppliers from "../../core/combineSuppliers.js";
import Component from "../Component.js";
import ComponentChildren from "../../types/ComponentChildren.js";
import ComponentModifier from "../../types/ComponentModifier.js";
import createStore from "../../core/createStore.js";
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
	declare _attributes: { [key:string]: unknown };
	declare _children: ComponentChildren;
	declare _listeners: { [key:string]: EventListenerOrEventListenerObject };
	declare _elementSubscriber: Subscriber<Element>|null;
	declare _isSelfClosing: boolean;
	declare _domNode: Element;
	declare _namespace?: 'svg'|'mathml';

	constructor(
		tagName: string,
		attributes: { [key: string]: unknown } = {},
		children: ComponentChildren = []
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

	attributes(): { [key:string]: unknown }
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

	elementSubscriber(subscriber?: Subscriber<Element>|null): Subscriber<Element>|null
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

	setup(parentComponent: null|Component, namespace?: 'svg'|'mathml', modifier?: ComponentModifier): void
	{
		if (this._tagName === 'svg') {
			this._namespace = 'svg';
		} else if (this._tagName === 'math') {
			this._namespace = 'mathml';
		} else {
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
			} else if (child instanceof ElementComponent) {
				child.setup(parentComponent, this._namespace, modifier);
			}
		}
	}

	createDomNode(): Element
	{
		if (this._namespace === undefined) {
			return document.createElement(
				this._tagName,
				{ is: this._attributes.is as string }
			);
		} else if (this._namespace === 'svg') {
			return document.createElementNS(
				'http://www.w3.org/2000/svg',
				this._tagName,
				{ is: this._attributes.is as string }
			);
		} else if (this._namespace === 'mathml') {
			return document.createElementNS(
				'http://www.w3.org/1998/Math/MathML',
				this._tagName,
				{ is: this._attributes.is as string }
			);
		} else {
			throw new Error(`Unsupported namespace "${this._namespace}" encountered`);
		}
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

		for (const attr of Object.keys(this._attributes)) {
			if (attr === '()') {
				(this._attributes[attr] as (e:Element, a:'()')=>void)(element, attr);
			} else if (isSupplier<Attribute>(this._attributes[attr])) {
				createAttributeFunction(this._attributes[attr] as Supplier<Attribute>)(element, attr);
			} else if (attr === 'class' && typeof this._attributes[attr] === 'object' && this._attributes[attr] !== null) {
				createAttributeFunction(attrClass(this._attributes[attr] as ClassDefinitions))(element, attr);
			} else if (attr === 'style' && typeof this._attributes[attr] === 'object' && this._attributes[attr] !== null) {
				createAttributeFunction(attrStyle(this._attributes[attr] as StyleDefinitions))(element, attr);
			} else {
				setAttribute(element, attr, this._attributes[attr] as Attribute);
			}
		}

		for (const event of Object.keys(this._listeners)) {
			element.addEventListener(event, this._listeners[event]);
		}

		for (const node of this._children) {
			node.setupDom();
		}
		if (! nodeExists) {
			for (const node of this.getChildNodes()) {
				element.appendChild(node);
			}
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

	notifyAfterSetup()
	{
		for (const vDomItem of this._children) {
			if ((vDomItem instanceof Component) || (vDomItem instanceof ElementComponent)) {
				vDomItem.notifyAfterSetup();
			}
		}
	}

	notifyAfterAttachToDom(): void
	{
		for (const vDomItem of this._children) {
			if ((vDomItem instanceof Component) || (vDomItem instanceof ElementComponent)) {
				vDomItem.notifyAfterAttachToDom();
			}
		}
	}

	notifyBeforeDetachFromDom(): void
	{
		for (const vDomItem of this._children) {
			if ((vDomItem instanceof Component) || (vDomItem instanceof ElementComponent)) {
				vDomItem.notifyBeforeDetachFromDom();
			}
		}
	}
}

export default
interface ElementComponent extends NativeComponent {}

applyNativeComponentMixin(ElementComponent);

type StyleDefinitions = {
	[cssProperty: string]: string|false|Supplier<string|false>,
};

function styleObjectToStringMapper(namedStyles: { [prop: string]: string|false }): string|false
{
	const mappedStyles = Object.keys(namedStyles)
		.map((propName) => [propName, namedStyles[propName]])
		.filter(([,propVal]) => propVal !== false)
		.map((prop) => prop.join(': '));
	return mappedStyles.length === 0 ? false : mappedStyles.join('; ');
}

function styleArrayToStringMapper(styles: Array<string|false>): string|false
{
	const mappedStyles = styles.filter(propVal => propVal !== false);
	return mappedStyles.length === 0 ? false : mappedStyles.join('; ');
}

function attrStyle(styleDefinitions: StyleDefinitions|Array<string|Supplier<string|false>|StyleDefinitions>): Supplier<string|false>
{
	if (styleDefinitions instanceof Array) {
		return map(
			combineSuppliers<Array<string|false>>(styleDefinitions.map(styleDefn => {
				if (isSupplier<string|false>(styleDefn)) {
					return styleDefn;
				}
				if (typeof styleDefn === 'object' && styleDefn !== null) {
					const namedSuppliers: {[prop: string]: Supplier<string|false>} = {};
					for (const name in styleDefn) {
						const propValue = styleDefn[name];
						namedSuppliers[name] = isSupplier<string|false>(propValue)
							? propValue
							: createStore(propValue);
					}
					return map(
						combineNamedSuppliers<{[prop: string]: string|false}>(namedSuppliers),
						styleObjectToStringMapper
					);
				}
				return createStore(styleDefn);
			})),
			styleArrayToStringMapper
		);
	} else {
		return attrStyle([styleDefinitions]);
	}
}

type ClassDefinitions = {
	[className: string]: boolean|Supplier<boolean>,
};

function classObjectToStringMapper(namedClasses: { [prop: string]: boolean }): string|false
{
	const mappedClasses = Object
		.keys(namedClasses)
		.map((class_) => [class_, namedClasses[class_]])
		.filter(([, classVal]) => classVal !== false)
		.map(([class_]) => class_);
	return mappedClasses.length === 0 ? false : mappedClasses.join(' ');
}

function classArrayToStringMapper(classes: Array<string|false>): string|false
{
	const mappedClasses = classes.filter(class_ => class_ !== false);
	return mappedClasses.length === 0 ? false : mappedClasses.join(' ');
}

function attrClass(classDefinitions: ClassDefinitions|Array<string|Supplier<string|false>|ClassDefinitions>): Supplier<string|false>
{
	if (classDefinitions instanceof Array) {
		return map(
			combineSuppliers<Array<string|false>>(classDefinitions.map(classDefn => {
				if (isSupplier<string|false>(classDefn)) {
					return classDefn;
				}
				if (typeof classDefn === 'object' && classDefn !== null) {
					const namedSuppliers: {[prop: string]: Supplier<boolean>} = {};
					for (const name in classDefn) {
						const propValue = classDefn[name];
						namedSuppliers[name] = isSupplier<boolean>(propValue)
							? propValue
							: createStore(propValue);
					}
					return map(
						combineNamedSuppliers<{[prop: string]: boolean}>(namedSuppliers),
						classObjectToStringMapper,
					);
				}
				return createStore(classDefn);
			})),
			classArrayToStringMapper
		);
	} else {
		return attrClass([classDefinitions]);
	}
}

type Attribute = string|boolean|null|undefined;

class AttributeSubscriber implements SubscriberObject<Attribute>
{
	declare _element: Element;
	declare _attributeName: string;

	constructor(element: Element, attributeName: string)
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
		element: Element,
		attributeName: string,
	): void {
		setAttribute(element, attributeName, supplier._());
		supplier.subscribe(new AttributeSubscriber(element, attributeName));
	};
}

function setAttribute(element: Element, name: string, value: Attribute)
{
	if (value === true) {
		element.setAttribute(name, '');
	} else if (([ undefined, null, false ] as unknown[]).indexOf(value) !== -1) {
		element.removeAttribute(name);
	} else {
		element.setAttribute(name, <string> value);
	}
}
