import CommentComponent from './_internal/CommentComponent.js';
import Component from './Component.js';
import ElementComponent from './_internal/ElementComponent.js';
import TextComponent from './_internal/TextComponent.js';
export default function hydrate(component, domNodes, currentIndex = 0) {
    const componentFirstNode = domNodes[currentIndex];
    if (!(componentFirstNode instanceof Comment)) {
        throw new Error('The first node of component was not found');
    }
    component.firstNode(componentFirstNode);
    currentIndex++;
    currentIndex = hydrateComponentChildren(component.children(), domNodes, currentIndex);
    const componentLastNode = domNodes[currentIndex];
    if (!(componentLastNode instanceof Comment)) {
        throw new Error('The last node of component was not found');
    }
    component.lastNode(componentLastNode);
    currentIndex++;
    return currentIndex;
}
export function hydrateComponentChildren(componentChildren, domNodes, currentIndex = 0) {
    componentChildren.forEach((componentChild) => {
        const node = domNodes[currentIndex];
        if (componentChild instanceof TextComponent) {
            if (!(node instanceof Text)) {
                throw new Error('Text not found');
            }
            componentChild.domNode(node);
            currentIndex++;
        }
        else if (componentChild instanceof CommentComponent) {
            if (!(node instanceof Comment)) {
                throw new Error('Comment not found');
            }
            componentChild.domNode(node);
            currentIndex++;
        }
        else if (componentChild instanceof ElementComponent) {
            if (!(node instanceof HTMLElement)) {
                throw new Error('HTMLElement not found');
            }
            Object.keys(componentChild.attributes()).forEach((attributeName) => {
                if (componentChild.attributes()[attributeName] !== node.getAttribute(attributeName)) {
                    throw new Error(`Value of attribute "${attributeName}" of HTMLElement does not match.`);
                }
            });
            componentChild.domNode(node);
            hydrateComponentChildren(componentChild.children(), node.childNodes);
            currentIndex++;
        }
        else if (componentChild instanceof Component) {
            currentIndex = hydrate(componentChild, domNodes, currentIndex);
        }
        else {
            console.error('Unsupported data found', componentChild);
            throw new Error('Unsupported data found');
        }
    });
    return currentIndex;
}
