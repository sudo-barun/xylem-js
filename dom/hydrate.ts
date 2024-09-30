import ComponentChildren from '../types/ComponentChildren.js';
import CommentComponent from './_internal/CommentComponent.js';
import Component from './Component.js';
import ElementComponent from './_internal/ElementComponent.js';
import TextComponent from './_internal/TextComponent.js';
import getValue from '../utilities/getValue.js';
import RawHTML from './RawHTML.js';

export default
function hydrate(component: Component, domNodes: ArrayLike<Node>, currentIndex = 0): number
{
	const componentFirstNode = domNodes[currentIndex];
	if (! (componentFirstNode instanceof Comment)) {
		throw new Error('The first node of component was not found');
	}
	component.firstNode(componentFirstNode);
	currentIndex++;

	currentIndex = hydrateComponentChildren(component.children(), domNodes, currentIndex);

	const componentLastNode = domNodes[currentIndex];
	if (! (componentLastNode instanceof Comment)) {
		throw new Error('The last node of component was not found');
	}
	component.lastNode(componentLastNode);
	currentIndex++;

	return currentIndex;
}

export
function hydrateComponentChildren(componentChildren: ComponentChildren, domNodes: ArrayLike<Node>, currentIndex = 0): number
{
	for (const componentChild of componentChildren) {
		const node = domNodes[currentIndex];

		if (componentChild instanceof TextComponent) {

			if (! (node instanceof Text)) {
				console.error('Text node not found.');
				console.error('Expected: Text node with text content:', getValue(componentChild.textContent()));
				console.error('Found:', node);
				throw new Error('Text node not found.');
			}
			componentChild.domNode(node);
			currentIndex++;

		} else if (componentChild instanceof CommentComponent) {

			if (! (node instanceof Comment)) {
				console.error('Comment node not found.');
				console.error('Expected: Comment node with text content:', getValue(componentChild.textContent()));
				console.error('Found:', node);
				throw new Error('Comment node not found.');
			}
			componentChild.domNode(node);
			currentIndex++;

		} else if (componentChild instanceof ElementComponent) {

			if (! (node instanceof Element)) {
				console.error('Element node not found.');
				console.error('Expected: Element node with tagName:', componentChild.tagName());
				console.error('Found:', node);
				throw new Error('Element node not found.');
			}
			for (const attributeName of Object.keys(componentChild.attributes())) {
				const attrVal = getValue(componentChild.attributes()[attributeName]);
				if (typeof attrVal === 'string') {
					if (attrVal !== node.getAttribute(attributeName)) {
						console.error(`Value of attribute "${attributeName}" of Element does not match.`);
						console.error('Expected: ', attrVal);
						console.error('Found: ', node.getAttribute(attributeName));
					}
				} else if (typeof attrVal === 'boolean') {
					if (attrVal !== node.hasAttribute(attributeName)) {
						if (attrVal) {
							throw new Error(`Attribute "${attributeName}" is missing.`);
						} else {
							throw new Error(`Attribute "${attributeName}" is present.`);
						}
					} else {
						const attributeValue = node.getAttribute(attributeName);
						if (attrVal && attributeValue !== '') {
							throw new Error(`Attribute "${attributeName}" should be empty, got "${attributeValue}".`);
						}
					}
				}
			}
			componentChild.domNode(node);
			hydrateComponentChildren(componentChild.children(), node.childNodes);
			currentIndex++;

		} else if (componentChild instanceof Component) {

			if (componentChild instanceof RawHTML) {
				const domNodesSlice = Array.prototype.slice.call(domNodes, currentIndex, currentIndex + 3);
				currentIndex += 3;
				componentChild.setChildNodes(domNodesSlice);
			} else {
				currentIndex = hydrate(componentChild, domNodes, currentIndex);
			}

		} else {
			console.error('Unsupported data found', componentChild);
			throw new Error('Unsupported data found');
		}
	}

	return currentIndex;
}
