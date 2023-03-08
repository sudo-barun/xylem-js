import ComponentItem from '../types/ComponentItem.js';
import Comment from './Comment.js';
import Component from './Component.js';
import Element from './Element.js';
import Text from './Text.js';

export default
function hydrate(component: Component, domNodes: ArrayLike<Node>, currentIndex = 0): number
{
	const componentFirstNode = domNodes[currentIndex];
	if (! (componentFirstNode instanceof globalThis.Comment)) {
		throw new Error('The first node of component was not found');
	}
	component.setFirstNode(componentFirstNode);
	currentIndex++;

	currentIndex = hydrateComponentItems(component.getVirtualDom(), domNodes, currentIndex);

	const componentLastNode = domNodes[currentIndex];
	if (! (componentLastNode instanceof globalThis.Comment)) {
		throw new Error('The last node of component was not found');
	}
	component.setLastNode(componentLastNode);
	currentIndex++;

	return currentIndex;
}

export
function hydrateComponentItems(componentItems: ComponentItem[], domNodes: ArrayLike<Node>, currentIndex = 0): number
{
	componentItems.forEach((componentItem) => {
		const node = domNodes[currentIndex];

		if (componentItem instanceof Text) {

			if (! (node instanceof globalThis.Text)) {
				throw new Error('Text not found');
			}
			componentItem.setDomNode(node);
			currentIndex++;

		} else if (componentItem instanceof Comment) {

			if (! (node instanceof globalThis.Comment)) {
				throw new Error('Comment not found');
			}
			componentItem.setDomNode(node);
			currentIndex++;

		} else if (componentItem instanceof Element) {

			if (! (node instanceof HTMLElement)) {
				throw new Error('HTMLElement not found');
			}
			Object.keys(componentItem.attributes).forEach((attributeName) => {
				if (componentItem.attributes[attributeName] !== node.getAttribute(attributeName)) {
					throw new Error(`Value of attribute "${attributeName}" of HTMLElement does not match.`);
				}
			});
			componentItem.setDomNode(node);
			hydrateComponentItems(componentItem.children, [...node.childNodes]);
			currentIndex++;

		} else if (componentItem instanceof Component) {

			currentIndex = hydrate(componentItem, domNodes, currentIndex);

		} else {
			console.error('Unsupported data found', componentItem);
			throw new Error('Unsupported data found');
		}
	})

	return currentIndex;
}
