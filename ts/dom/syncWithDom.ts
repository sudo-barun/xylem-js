import Element from './Element.js';

export default
function syncWithDom(element: Element, node: HTMLElement): void
{
	// TODO: handle other classes

	element.setDomNode(node);
	element.setup();
	element.setupDom();
}
