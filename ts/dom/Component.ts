import ComponentItem from "../types/ComponentItem.js";
import createProxy from "../core/createProxy.js";
import createProxyStore from "../core/createProxyStore.js";
import createStream from "../core/createStream.js";
import Element from "./Element.js";
import SourceStream from "../types/SourceStream.js";
import Store from "../types/Store.js";
import Stream from "../types/Stream.js";

export default
abstract class Component<Attributes = void>
{
	afterAttachToDom: Stream<void>;
	beforeDetachFromDom: Stream<void>;

	_attributes: Attributes;
	_virtualDom!: Array<ComponentItem>;
	_notifyAfterAttachToDom: SourceStream<void>;
	_notifyBeforeDetachFromDom: SourceStream<void>;
	_eventUnsubscribers: Array<()=>void>;

	constructor(attributes: Attributes)
	{
		this._attributes = attributes;
		this._notifyAfterAttachToDom = createStream<void>();
		this.afterAttachToDom = this._notifyAfterAttachToDom.subscribeOnly;
		this._notifyBeforeDetachFromDom = createStream<void>();
		this.beforeDetachFromDom = this._notifyBeforeDetachFromDom.subscribeOnly;
		this._eventUnsubscribers = [];
	}

	build(attributes: Attributes): Array<ComponentItem>
	{
		throw new Error(
			'Method "build" is not implemented in class '
			+ Object.getPrototypeOf(this).constructor.name
		);
	}

	setup(): void
	{
		const oldVirtualDom = this._virtualDom;
		const newVirtualDom = this.build(this._attributes);
		newVirtualDom.forEach(_vDom => {
			if ((_vDom instanceof Component) || (_vDom instanceof Element)) {
				_vDom.setup();
			}
		});

		if (oldVirtualDom) {
			const lastNode = this.getLastNode();
			const parentNode = lastNode?.parentNode;
			newVirtualDom.forEach(vDom => vDom.setupDom());
			if (parentNode) {
				newVirtualDom.slice().reverse().forEach((vDom) => {
					if (vDom instanceof Component) {
						vDom.getDomNodes().forEach((node) => {
							parentNode.insertBefore(node, lastNode.nextSibling);
						});
					} else {
						parentNode.insertBefore(vDom.getDomNode(), lastNode.nextSibling);
					}
				});
			}
			oldVirtualDom.forEach(vDom => vDom.detachFromDom());
		}

		this._virtualDom = newVirtualDom;
	}

	setupDom(): void
	{
		this._virtualDom.forEach(vDom => {
			vDom.setupDom();
		});
	}

	getDomNodes(): Array<ChildNode>
	{
		return this._virtualDom.map(vDom => {
			if (vDom instanceof Component) {
				return vDom.getDomNodes();
			} else {
				return [vDom.getDomNode()];
			}
		}).flat();
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

	getFirstNode(): ChildNode|null
	{
		if (this._virtualDom) {
			for (const vDom of this._virtualDom) {
				let node = null;
				if (vDom instanceof Component) {
					node = vDom.getFirstNode();
					if (node !== null) {
						return node;
					}
				} else {
					return vDom.getDomNode();
				}
			}
		}
		return null;
	}

	getLastNode(): ChildNode|null
	{
		if (this._virtualDom) {
			for (const vDom of this._virtualDom.slice().reverse()) {
				if (vDom instanceof Component) {
					let node = null;
					node = vDom.getLastNode();
					if (node !== null) {
						return node;
					}
				} else {
					return vDom.getDomNode();
				}
			}
		}
		return null;
	}

	attachToDom()
	{
		this._notifyAfterAttachToDom();
        this._virtualDom.forEach((vDomItem) => {
			if ((vDomItem instanceof Component) || (vDomItem instanceof Element)) {
				vDomItem.attachToDom();
			}
		});
	}

	detachFromDom()
	{
		this._notifyBeforeDetachFromDom();
		this._virtualDom.forEach(vDom => vDom.detachFromDom());
	}
}
