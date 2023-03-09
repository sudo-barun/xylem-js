type NativeComponent = {

	_domNode: ChildNode;

	setupDom(): void;

	getDomNode(): ChildNode;

	getDomNodes(): ChildNode[];

	getFirstNode(): ChildNode;

	getLastNode(): ChildNode;

	detachFromDom(): void;

	setDomNode(domNode: ChildNode): void

};

export default NativeComponent;
