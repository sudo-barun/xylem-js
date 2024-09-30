import CallSubscribers from "../utilities/_internal/CallSubscribers.js";
import ComponentChildren from "../types/ComponentChildren.js";
import ComponentModifier from "../types/ComponentModifier.js";
import createEmittableStream from "../core/createEmittableStream.js";
import Supplier from "../types/Supplier.js";
import ElementComponent from "./_internal/ElementComponent.js";
import EmittableStream from "../types/EmittableStream.js";
import Stream from "../types/Stream.js";
import Subscriber from "../types/Subscriber.js";
import SubscriberObject from "../types/SubscriberObject.js";
import Unsubscriber from "../types/Unsubscriber.js";
import UnsubscriberImpl from "../utilities/_internal/UnsubscriberImpl.js";

export default
abstract class Component<EarlyAttributes extends object = {}, LateAttributes extends object = {}>
{
	declare afterSetup: Stream<void>;
	declare afterAttachToDom: Stream<void>;
	declare beforeDetachFromDom: Stream<void>;

	declare _attributes: EarlyAttributes & LateAttributes;
	declare _modifier?: ComponentModifier;
	declare _children: ComponentChildren;
	declare _notifyAfterSetup: EmittableStream<void>;
	declare _notifyAfterAttachToDom: EmittableStream<void>;
	declare _notifyBeforeDetachFromDom: EmittableStream<void>;
	declare _eventUnsubscribers: Array<()=>void>;

	declare _firstNode: Comment;
	declare _lastNode: Comment;

	declare _parentComponent: null|Component;
	declare _namespace?: 'svg'|'mathml';

	constructor(attributes: EarlyAttributes = {} as EarlyAttributes)
	{
		this._attributes = attributes as typeof this._attributes;
		this._notifyAfterSetup = createEmittableStream<void>();
		this.afterSetup = this._notifyAfterSetup.subscribeOnly;
		this._notifyAfterAttachToDom = createEmittableStream<void>();
		this.afterAttachToDom = this._notifyAfterAttachToDom.subscribeOnly;
		this._notifyBeforeDetachFromDom = createEmittableStream<void>();
		this.beforeDetachFromDom = this._notifyBeforeDetachFromDom.subscribeOnly;
		this._eventUnsubscribers = [];
		this._modifier = undefined;
		this._children = undefined!;
		this._firstNode = undefined!;
		this._lastNode = undefined!;
		this._parentComponent = null;
	}

	abstract build(attributes: EarlyAttributes & LateAttributes): ComponentChildren;

	injectAttributes(attributes: LateAttributes)
	{
		this._attributes = { ...attributes, ...this._attributes };
	}

	setParentComponent(parentComponent: null|Component)
	{
		this._parentComponent = parentComponent;
	}

	getParentComponent(): null|Component
	{
		return this._parentComponent;
	}

	setNamespace(namespace: 'svg'|'mathml'|undefined)
	{
		this._namespace = namespace;
	}

	getNamespace(): 'svg'|'mathml'|undefined
	{
		return this._namespace;
	}

	setModifier(modifier: ComponentModifier)
	{
		this._modifier = modifier;
	}

	setup(modifier?: ComponentModifier): void
	{
		if (arguments.length === 0) {
			modifier = this._modifier;
		} else {
			this._modifier = modifier;
		}
		if (modifier) {
			modifier(this);
		}

		const children = this.build(this._attributes);
		for (const _vDom of children) {
			if ((_vDom instanceof Component)) {
				_vDom.setParentComponent(this);
				if (this._namespace !== undefined) {
					_vDom.setNamespace(this._namespace);
				}
				_vDom.setup(modifier);
			} else if (_vDom instanceof ElementComponent) {
				_vDom.setup(this, this._namespace, modifier);
			}
		}

		this._children = children;
	}

	reload(): void
	{
		this.notifyBeforeDetachFromDom();
		for (const vDomItem of this._children) {
			vDomItem.detachFromDom();
		}

		this._notifyAfterSetup = createEmittableStream<void>();
		this.afterSetup = this._notifyAfterSetup.subscribeOnly;
		this._notifyAfterAttachToDom = createEmittableStream<void>();
		this.afterAttachToDom = this._notifyAfterAttachToDom.subscribeOnly;
		this._notifyBeforeDetachFromDom = createEmittableStream<void>();
		this.beforeDetachFromDom = this._notifyBeforeDetachFromDom.subscribeOnly;

		this.setup(this._modifier);
		this.notifyAfterSetup();
		for (const vDom of this._children) {
			vDom.setupDom();
		}

		for (const node of this.childNodes()) {
			this._lastNode.parentNode!.insertBefore(node, this._lastNode);
		}

		this.notifyAfterAttachToDom();
	}

	getComponentName(): string
	{
		const componentName = Object.getPrototypeOf(this).constructor.name;
		return typeof componentName === 'string' ? componentName : '';
	}

	setupDom(): void
	{
		this._firstNode = this._firstNode || document.createComment(`${this.getComponentName()}`);
		this._lastNode = this._lastNode || document.createComment(`/${this.getComponentName()}`);

		for (const vDom of this._children) {
			vDom.setupDom();
		}
	}

	domNodes(): Array<ChildNode>
	{
		const nodes = this.childNodes();
		nodes.unshift(this._firstNode);
		nodes.push(this._lastNode);
		return nodes;
	}

	childNodes(): ChildNode[]
	{
		return this._children.map(vDom => vDom.domNodes())
		.reduce((acc, item) => {
			acc.push(...item);
			return acc;
		}, [] as ChildNode[]);
	}

	children(): ComponentChildren
	{
		return this._children;
	}

	firstNode(node?: Comment): Comment
	{
		if (arguments.length !== 0) {
			this._firstNode = node!;
		}
		return this._firstNode;
	}

	lastNode(node?: Comment): Comment
	{
		if (arguments.length !== 0) {
			this._lastNode = node!;
		}
		return this._lastNode;
	}

	notifyAfterSetup()
	{
		this._notifyAfterSetup._();
		for (const vDomItem of this._children) {
			if ((vDomItem instanceof Component) || (vDomItem instanceof ElementComponent)) {
				vDomItem.notifyAfterSetup();
			}
		}
	}

	notifyAfterAttachToDom()
	{
		this._notifyAfterAttachToDom._();
		for (const vDomItem of this._children) {
			if ((vDomItem instanceof Component) || (vDomItem instanceof ElementComponent)) {
				vDomItem.notifyAfterAttachToDom();
			}
		}
	}

	notifyBeforeDetachFromDom()
	{
		this._notifyBeforeDetachFromDom._();
		for (const vDomItem of this._children) {
			if ((vDomItem instanceof Component) || (vDomItem instanceof ElementComponent)) {
				vDomItem.notifyBeforeDetachFromDom();
			}
		}
	}

	detachFromDom()
	{
		for (const vDomItem of this._children) {
			vDomItem.detachFromDom();
		}
		this._firstNode.parentNode!.removeChild(this._firstNode);
		this._lastNode.parentNode!.removeChild(this._lastNode);
	}

	bindSupplier<R extends Supplier<unknown>>(supplier: R): R
	{
		return new ComponentBoundedSupplier(this, supplier) as unknown as R;
	}
}

class ComponentBoundedSupplier<T> implements Supplier<T>
{
	declare _component: Component;
	declare _supplier: Supplier<T>;
	declare _subscribers: Subscriber<T>[];

	constructor(component: Component, supplier: Supplier<T>)
	{
		this._component = component;
		this._supplier = supplier;
		this._subscribers = [];

		component.beforeDetachFromDom.subscribe(supplier.subscribe(new SubscriberImpl(this)));
	}

	_(): T
	{
		return this._supplier._.apply(this._supplier, arguments as unknown as []);
	}

	_emit(value: T)
	{
		const callSubscribers = new CallSubscribers(this);
		callSubscribers._.apply(callSubscribers, arguments as unknown as [T]);
	}

	subscribe(subscriber: Subscriber<T>): Unsubscriber
	{
		this._subscribers.push(subscriber);
		return new UnsubscriberImpl(this, subscriber);
	}
}

class SubscriberImpl<T> implements SubscriberObject<T>
{
	declare _componentBoundedSupplier: ComponentBoundedSupplier<T>;

	constructor(componentBoundedSupplier: ComponentBoundedSupplier<T>)
	{
		this._componentBoundedSupplier = componentBoundedSupplier;
	}

	_(value: T): void
	{
		this._componentBoundedSupplier._emit(value);
	}
}
