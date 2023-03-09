import NativeComponent from "../../types/_internal/NativeComponent.js";

const NativeComponentMixin = {

	getDomNode(this: NativeComponent): ChildNode
	{
		return this._domNode;
	},

	getDomNodes(this: NativeComponent): ChildNode[]
	{
		return [ this.getDomNode() ];
	},

	getFirstNode(this: NativeComponent): ChildNode
	{
		return this.getDomNode();
	},

	getLastNode(this: NativeComponent): ChildNode
	{
		return this.getDomNode();
	},

	setDomNode(this: NativeComponent, domNode: ChildNode): void
	{
		this._domNode = domNode;
	},

	detachFromDom(this: NativeComponent): void
	{
		this._domNode.parentNode!.removeChild(this._domNode);
	}

};

type Constructor = new (...args: any[]) => {};

export default
function applyNativeComponentMixin(constructor: Constructor)
{
	Object.getOwnPropertyNames(NativeComponentMixin).forEach((name) => {
		if (constructor.prototype.hasOwnProperty(name)) {
			return;
		}
		Object.defineProperty(
			constructor.prototype,
			name,
			Object.getOwnPropertyDescriptor(NativeComponentMixin, name) ||
				Object.create(null)
		);
	});
}
