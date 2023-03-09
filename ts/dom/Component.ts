import ComponentItem from "../types/ComponentItem.js";
import ComponentModifier from "../types/ComponentModifier.js";
import createProxy from "../core/createProxy.js";
import createProxyStore from "../core/createProxyStore.js";
import createStream from "../core/createStream.js";
import Element from "./Element.js";
import SourceStream from "../types/SourceStream.js";
import Store from "../types/Store.js";
import Stream from "../types/Stream.js";

export default
abstract class Component<EarlyAttributes extends object = {}, LateAttributes extends object = {}>
{
	declare afterAttachToDom: Stream<void>;
	declare beforeDetachFromDom: Stream<void>;

	declare _attributes: EarlyAttributes & LateAttributes;
	declare _modifier?: ComponentModifier;
	declare _virtualDom: Array<ComponentItem>;
	declare _notifyAfterAttachToDom: SourceStream<void>;
	declare _notifyBeforeDetachFromDom: SourceStream<void>;
	declare _eventUnsubscribers: Array<()=>void>;

	declare _firstNode: Comment;
	declare _lastNode: Comment;

	constructor(attributes: EarlyAttributes = {} as EarlyAttributes)
	{
		this._attributes = attributes as typeof this._attributes;
		this._notifyAfterAttachToDom = createStream<void>();
		this.afterAttachToDom = this._notifyAfterAttachToDom.subscribeOnly;
		this._notifyBeforeDetachFromDom = createStream<void>();
		this.beforeDetachFromDom = this._notifyBeforeDetachFromDom.subscribeOnly;
		this._eventUnsubscribers = [];
		this._modifier = undefined;
		this._virtualDom = undefined!;
		this._firstNode = undefined!;
		this._lastNode = undefined!;
	}

	abstract build(attributes: EarlyAttributes & LateAttributes): Array<ComponentItem>;

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

		const virtualDom = this.build(this._attributes);
		virtualDom.forEach(_vDom => {
			if ((_vDom instanceof Component) || (_vDom instanceof Element)) {
				_vDom.setup(modifier);
			}
		});

		this._virtualDom = virtualDom;
	}

	reload(): void
	{
		this.notifyBeforeDetachFromDom();
		this._virtualDom.forEach(vDomItem => {
			vDomItem.detachFromDom();
		});

		this._notifyAfterAttachToDom = createStream<void>();
		this.afterAttachToDom = this._notifyAfterAttachToDom.subscribeOnly;
		this._notifyBeforeDetachFromDom = createStream<void>();
		this.beforeDetachFromDom = this._notifyBeforeDetachFromDom.subscribeOnly;

		this.setup(this._modifier);
		this._virtualDom.forEach(vDom => {
			vDom.setupDom();
		});

		this.getChildNodes().forEach((node) => {
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

		this._virtualDom.forEach(vDom => {
			vDom.setupDom();
		});
	}

	getDomNodes(): Array<ChildNode>
	{
		const nodes = this.getChildNodes();
		nodes.unshift(this._firstNode);
		nodes.push(this._lastNode);
		return nodes;
	}

	getChildNodes(): ChildNode[]
	{
		return this._virtualDom.map(vDom => vDom.getDomNodes())
		.reduce((acc, item) => {
			acc.push(...item);
			return acc;
		}, [] as ChildNode[]);
	}

	getVirtualDom(): Array<ComponentItem>
	{
		return this._virtualDom;
	}

	createProxyStore<T>(store: Store<T>): Store<T>
	{
		const proxy = createProxyStore(store, store);
		this.beforeDetachFromDom.subscribe(() => {
			proxy.unsubscribeFromSource();
		});
		return proxy;
	}

	deriveStore<T>(immutSubFuncVar: Store<T>): Store<T>
	{
		return createProxy(immutSubFuncVar, this.beforeDetachFromDom.subscribe);
	}

	getFirstNode(): Comment
	{
		return this._firstNode;
	}

	setFirstNode(node: Comment): void
	{
		this._firstNode = node;
	}

	getLastNode(): Comment
	{
		return this._lastNode;
	}

	setLastNode(node: Comment): void
	{
		this._lastNode = node;
	}

	notifyAfterAttachToDom()
	{
		this._notifyAfterAttachToDom();
		this._virtualDom.forEach((vDomItem) => {
			if ((vDomItem instanceof Component) || (vDomItem instanceof Element)) {
				vDomItem.notifyAfterAttachToDom();
			}
		});
	}

	notifyBeforeDetachFromDom()
	{
		this._notifyBeforeDetachFromDom();
		this._virtualDom.forEach((vDomItem) => {
			if ((vDomItem instanceof Component) || (vDomItem instanceof Element)) {
				vDomItem.notifyBeforeDetachFromDom();
			}
		});
	}

	detachFromDom()
	{
		this._virtualDom.forEach((vDomItem) => {
			vDomItem.detachFromDom();
			this._firstNode.parentNode!.removeChild(this._firstNode);
			this._lastNode.parentNode!.removeChild(this._lastNode);
		});
	}
}
