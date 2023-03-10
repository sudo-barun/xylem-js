type NativeComponent = {

	_domNode: ChildNode;

	setupDom(): void;

	domNode(domNode?: ChildNode): ChildNode;

	domNodes(): ChildNode[];

	firstNode(): ChildNode;

	lastNode(): ChildNode;

	detachFromDom(): void;

};

export default NativeComponent;
