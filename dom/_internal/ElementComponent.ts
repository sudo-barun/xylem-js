import applyNativeComponentMixin from "./applyNativeComponentMixin.js";
import combineNamedSuppliers from "../../core/combineNamedSuppliers.js";
import combineSuppliers from "../../core/combineSuppliers.js";
import Component from "../Component.js";
import type ComponentChildren from "../../types/ComponentChildren.js";
import type ComponentModifier from "../../types/ComponentModifier.js";
import createStore from "../../core/createStore.js";
import type Supplier from "../../types/Supplier.js";
import isSupplier from "../../utilities/isSupplier.js";
import map from "../../core/map.js";
import type NativeComponent from "../../types/_internal/NativeComponent.js";
import type Subscriber from "../../types/Subscriber.js";
import type SubscriberObject from "../../types/SubscriberObject.js";
import type EmittableStream from "../../types/EmittableStream.js";
import type Stream from "../../types/Stream.js";
import createEmittableStream from "../../core/createEmittableStream.js";
import type HasLifecycle from "../../types/HasLifecycle.js";

export default
class ElementComponent
{
	declare _tagName: string;
	declare _attributes: { [key:string]: unknown };
	declare _children: ComponentChildren;
	declare _listeners: {
		[key:string]:
			| EventListenerOrEventListenerObject
			| [ EventListenerOrEventListenerObject, boolean | EventListenerOptions ]
	};
	declare _elementSubscriber: Subscriber<Element>|null;
	declare _domNode: Element;
	declare _namespace?: 'svg'|'mathml';
	declare _notifyBeforeDetachFromDom: EmittableStream<void>;
	declare beforeDetachFromDom: Stream<void>;

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
		this._domNode = undefined!;
		this._notifyBeforeDetachFromDom = createEmittableStream<void>();
		this.beforeDetachFromDom = this._notifyBeforeDetachFromDom.subscribeOnly;
	}

	tagName(): string
	{
		return this._tagName;
	}

	attributes(): { [key:string]: unknown }
	{
		return this._attributes;
	}

	getNamespace(): 'html'|'svg'|'mathml'
	{
		return this._namespace ?? 'html';
	}

	children(): ComponentChildren
	{
		return this._children;
	}

	listeners(): typeof this._listeners
	{
		return this._listeners;
	}

	addListener(eventName: string, listener: (typeof this._listeners)[''])
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
		const isNewNode = !this._domNode;
		const element = this._domNode = this._domNode || this.createDomNode();

		for (const attr of Object.keys(this._attributes)) {
			if (attr === '()') {
				(this._attributes[attr] as (e:Element, a:'()')=>void)(element, attr);
			} else if (isSupplier<Attribute>(this._attributes[attr])) {
				createAttributeFunction(this, this._attributes[attr] as Supplier<Attribute>)(element, attr, isNewNode);
			} else if (attr === 'class' && typeof this._attributes[attr] === 'object' && this._attributes[attr] !== null) {
				createAttributeFunction(this, attrClass(this, this._attributes[attr] as ClassDefinitions))(element, attr, isNewNode);
			} else if (attr === 'style' && typeof this._attributes[attr] === 'object' && this._attributes[attr] !== null) {
				createAttributeFunction(this, attrStyle(this, this._attributes[attr] as StyleDefinitions))(element, attr, isNewNode);
			} else {
				if (isNewNode) {
					setAttribute(element, attr, this._attributes[attr] as Attribute);
				}
			}
		}

		for (const event of Object.keys(this._listeners)) {
			const listener = this._listeners[event];
			if (listener instanceof Array) {
				element.addEventListener(event, listener[0], listener[1]);
			} else {
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
			} else {
				this._elementSubscriber._(element);
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
		this._notifyBeforeDetachFromDom._();
		for (const vDomItem of this._children) {
			vDomItem.notifyBeforeDetachFromDom();
		}
	}
}

export default
interface ElementComponent extends NativeComponent {}

applyNativeComponentMixin(ElementComponent);

export
type StyleDefinitions = {
	[cssProperty: string]: string|number|bigint|false|null|undefined|Supplier<string|number|bigint|false|null|undefined>,
};

function styleObjectToStringMapper(namedStyles: { [prop: string]: string|number|bigint|false|null|undefined }): string|false
{
	const mappedStyles = Object.keys(namedStyles)
		.map((propName) => [propName, namedStyles[propName]])
		.filter(([,propVal]) => propVal !== '' && propVal !== false && propVal !== null && propVal !== undefined)
		.map((prop) => prop.join(': '));
	return mappedStyles.length === 0 ? false : mappedStyles.join('; ');
}

function styleArrayToStringMapper(styles: Array<string|false|null|undefined>): string|false
{
	let mappedStyles: string[] = styles.filter(propVal => propVal !== false && propVal !== null && propVal !== undefined);
	if (mappedStyles.length > 1) {
		mappedStyles = mappedStyles.filter(class_ => class_ !== '');
		if (mappedStyles.length === 0) {
			mappedStyles = [''];
		}
	}

	return mappedStyles.length === 0 ? false : mappedStyles.join('; ');
}

export
function attrStyle(hasLifecycle: HasLifecycle, styleDefinitions: StyleDefinitions|Array<string|Supplier<string|false>|StyleDefinitions>): Supplier<string|false>
{
	if (styleDefinitions instanceof Array) {
		return map(
			hasLifecycle,
			combineSuppliers(hasLifecycle, styleDefinitions.map(styleDefn => {
				if (isSupplier<string|false>(styleDefn)) {
					return styleDefn;
				}
				if (typeof styleDefn === 'object' && styleDefn !== null) {
					const namedSuppliers: {[prop: string]: Supplier<string|number|bigint|false|null|undefined>} = {};
					for (const name in styleDefn) {
						const propValue = styleDefn[name];
						namedSuppliers[name] = isSupplier(propValue)
							? propValue
							: createStore(propValue);
					}
					return map(
						hasLifecycle,
						combineNamedSuppliers(hasLifecycle, namedSuppliers),
						styleObjectToStringMapper
					);
				}
				return createStore(styleDefn);
			})),
			styleArrayToStringMapper
		);
	} else {
		return attrStyle(hasLifecycle, [styleDefinitions]);
	}
}

export
type ClassDefinitions = {
	[className: string]: unknown|Supplier<unknown>,
};

function classObjectToStringMapper(namedClasses: { [prop: string]: unknown }): string|false
{
	const mappedClasses = Object
		.keys(namedClasses)
		.map((class_) => [class_, namedClasses[class_]] as [string, unknown])
		.filter(([, classVal]) => classVal)
		.map(([class_]) => class_);
	return mappedClasses.length === 0 ? false : mappedClasses.join(' ');
}

function classArrayToStringMapper(classes: Array<string|false|null|undefined>): string|false
{
	let mappedClasses: string[] = classes.filter(class_ => class_ !== false && class_ !== null && class_ !== undefined);
	if (mappedClasses.length > 1) {
		mappedClasses = mappedClasses.filter(class_ => class_ !== '');
		if (mappedClasses.length === 0) {
			mappedClasses = [''];
		}
	}

	return mappedClasses.length === 0 ? false : mappedClasses.join(' ');
}

export
function attrClass(hasLifecycle: HasLifecycle, classDefinitions: ClassDefinitions|Array<string|false|null|undefined|Supplier<string|false|null|undefined>|ClassDefinitions>): Supplier<string|false>
{
	if (classDefinitions instanceof Array) {
		return map(
			hasLifecycle,
			combineSuppliers(hasLifecycle, classDefinitions.map(classDefn => {
				if (isSupplier<string|false>(classDefn)) {
					return classDefn;
				}
				if (typeof classDefn === 'object' && classDefn !== null) {
					const namedSuppliers: {[prop: string]: Supplier<unknown>} = {};
					for (const name in classDefn) {
						const propValue = (classDefn as ClassDefinitions)[name];
						namedSuppliers[name] = isSupplier(propValue)
							? propValue
							: createStore(propValue);
					}
					return map(
						hasLifecycle,
						combineNamedSuppliers(hasLifecycle, namedSuppliers),
						classObjectToStringMapper,
					);
				}
				return createStore(classDefn);
			})),
			classArrayToStringMapper
		);
	} else {
		return attrClass(hasLifecycle, [classDefinitions]);
	}
}

export
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

function createAttributeFunction(hasLifecycle: HasLifecycle, supplier: Supplier<Attribute>)
{
	return function (
		element: Element,
		attributeName: string,
		isNewNode: boolean
	): void {
		if (isNewNode) {
			setAttribute(element, attributeName, supplier._());
		}
		hasLifecycle.beforeDetachFromDom.subscribe(
			supplier.subscribe(new AttributeSubscriber(element, attributeName))
		);
	};
}

function setAttribute(element: Element, name: string, value: Attribute)
{
	if (value === true) {
		element.setAttribute(name, '');
	} else if (([ undefined, null, false ] as unknown[]).indexOf(value) !== -1) {
		element.removeAttribute(name);
	} else {
		element.setAttribute(name, value as string);
	}
}
