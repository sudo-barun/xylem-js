import NativeComponent from "../../types/_internal/NativeComponent.js";

const NativeComponentMixin = {

	domNodes(this: NativeComponent): ChildNode[]
	{
		return [ this.domNode() ];
	},

	firstNode(this: NativeComponent): ChildNode
	{
		return this.domNode();
	},

	lastNode(this: NativeComponent): ChildNode
	{
		return this.domNode();
	},

	domNode(this: NativeComponent, domNode: ChildNode): ChildNode
	{
		if (arguments.length !== 0) {
			this._domNode = domNode;
		}
		return this._domNode;
	},

	detachFromDom(this: NativeComponent): void
	{
		this._domNode.parentNode!.removeChild(this._domNode);
	}

};

type Constructor<T extends unknown[]> = new (...args: T) => NativeComponent;

export default
function applyNativeComponentMixin<T extends unknown[]>(constructor: Constructor<T>)
{
	for (const name of Object.getOwnPropertyNames(NativeComponentMixin)) {
		if (constructor.prototype.hasOwnProperty(name)) {
			return;
		}
		Object.defineProperty(
			constructor.prototype,
			name,
			Object.getOwnPropertyDescriptor(NativeComponentMixin, name) ||
				Object.create(null)
		);
	}
}
