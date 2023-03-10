import ComponentChildren from "../types/ComponentChildren.js";
import ComponentModifier from "../types/ComponentModifier.js";
import createEmittableStream from "../core/createEmittableStream.js";
import createDataNode from "../core/createDataNode.js";
import DataNode from "../types/DataNode.js";
import ElementComponent from "./_internal/ElementComponent.js";
import EmittableStream from "../types/EmittableStream.js";
import Stream from "../types/Stream.js";
import Subscriber from "../types/Subscriber.js";

export default
abstract class Component<EarlyAttributes extends object = {}, LateAttributes extends object = {}>
{
	declare afterAttachToDom: Stream<void>;
	declare beforeDetachFromDom: Stream<void>;

	declare _attributes: EarlyAttributes & LateAttributes;
	declare _modifier?: ComponentModifier;
	declare _children: ComponentChildren;
	declare _notifyAfterAttachToDom: EmittableStream<void>;
	declare _notifyBeforeDetachFromDom: EmittableStream<void>;
	declare _eventUnsubscribers: Array<()=>void>;

	declare _firstNode: Comment;
	declare _lastNode: Comment;

	constructor(attributes: EarlyAttributes = {} as EarlyAttributes)
	{
		this._attributes = attributes as typeof this._attributes;
		this._notifyAfterAttachToDom = createEmittableStream<void>();
		this.afterAttachToDom = this._notifyAfterAttachToDom.subscribeOnly;
		this._notifyBeforeDetachFromDom = createEmittableStream<void>();
		this.beforeDetachFromDom = this._notifyBeforeDetachFromDom.subscribeOnly;
		this._eventUnsubscribers = [];
		this._modifier = undefined;
		this._children = undefined!;
		this._firstNode = undefined!;
		this._lastNode = undefined!;
	}

	abstract build(attributes: EarlyAttributes & LateAttributes): ComponentChildren;

	injectAttributes(attributes: LateAttributes)
	{
		this._attributes = { ...attributes, ...this._attributes };
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
		children.forEach(_vDom => {
			if ((_vDom instanceof Component) || (_vDom instanceof ElementComponent)) {
				_vDom.setup(modifier);
			}
		});

		this._children = children;
	}

	reload(): void
	{
		this.notifyBeforeDetachFromDom();
		this._children.forEach(vDomItem => {
			vDomItem.detachFromDom();
		});

		this._notifyAfterAttachToDom = createEmittableStream<void>();
		this.afterAttachToDom = this._notifyAfterAttachToDom.subscribeOnly;
		this._notifyBeforeDetachFromDom = createEmittableStream<void>();
		this.beforeDetachFromDom = this._notifyBeforeDetachFromDom.subscribeOnly;

		this.setup(this._modifier);
		this._children.forEach(vDom => {
			vDom.setupDom();
		});

		this.childNodes().forEach((node) => {
			this._lastNode.parentNode!.insertBefore(node, this._lastNode);
		});

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

		this._children.forEach(vDom => {
			vDom.setupDom();
		});
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

	notifyAfterAttachToDom()
	{
		this._notifyAfterAttachToDom();
		this._children.forEach((vDomItem) => {
			if ((vDomItem instanceof Component) || (vDomItem instanceof ElementComponent)) {
				vDomItem.notifyAfterAttachToDom();
			}
		});
	}

	notifyBeforeDetachFromDom()
	{
		this._notifyBeforeDetachFromDom();
		this._children.forEach((vDomItem) => {
			if ((vDomItem instanceof Component) || (vDomItem instanceof ElementComponent)) {
				vDomItem.notifyBeforeDetachFromDom();
			}
		});
	}

	detachFromDom()
	{
		this._children.forEach((vDomItem) => {
			vDomItem.detachFromDom();
			this._firstNode.parentNode!.removeChild(this._firstNode);
			this._lastNode.parentNode!.removeChild(this._lastNode);
		});
	}

	bindDataNode<T, DataNodeType extends DataNode<T>>(dataNode: DataNodeType): DataNodeType
	{
		const subscribers: Subscriber<T>[] = [];
		const boundedDataNode = function () {
			return dataNode.apply(null, arguments as any);
		};

		this.beforeDetachFromDom.subscribe(dataNode.subscribe((value)=>{
			subscribers.forEach(subscriber => subscriber(value));
		}));

		const removeSubscriber = function (subscriber: Subscriber<T>)
		{
			const index = subscribers.indexOf(subscriber);
			if (index === -1) {
				throw new Error('Subscriber already removed from the list of subscribers');
			}
			subscribers.splice(index, 1);
		};

		const subscribe = function (subscriber: Subscriber<T>)
		{
			subscribers.push(subscriber);
			return function () {
				removeSubscriber(subscriber);
			};
		};
		boundedDataNode.subscribe = subscribe;
		Object.defineProperty(boundedDataNode, 'subscribe', { value: subscribe });

		Object.defineProperty(boundedDataNode, '_source', { value: dataNode });

		return boundedDataNode as unknown as DataNodeType;
	}
}
