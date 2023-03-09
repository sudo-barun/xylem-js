import Comment from "../dom/Comment.js";
import Component from "../dom/Component.js";
import Element from "../dom/Element.js";
import Text from "../dom/Text.js";
const entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
};
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => entities[tag]);
}
function parseComponentItems(componentItems) {
    const strings = componentItems.map((componentItem) => {
        if (componentItem instanceof Text) {
            return escapeHTML(componentItem.getTextContentAsString());
        }
        else if (componentItem instanceof Comment) {
            return `<!--${escapeHTML(componentItem.getTextContentAsString())}-->`;
        }
        else if (componentItem instanceof Element) {
            const attributesString = Object.keys(componentItem.attributes).reduce((acc, attributeName) => {
                let attributeValue = '';
                if (componentItem.attributes[attributeName] instanceof Function) {
                    attributeValue = componentItem.attributes[attributeName]();
                }
                else {
                    attributeValue = componentItem.attributes[attributeName];
                }
                acc.push(`${attributeName}="${attributeValue}"`);
                return acc;
            }, []).join(' ');
            const tagName = componentItem.tagName;
            const childrenString = parseComponentItems(componentItem.children);
            const tagWithAttributes = attributesString ? [tagName, attributesString].join(' ') : tagName;
            if (componentItem.isSelfClosing()) {
                return `<${tagWithAttributes}/>`;
            }
            return `<${tagWithAttributes}>${childrenString}</${tagName}>`;
        }
        else if (componentItem instanceof Component) {
            return parseComponent(componentItem);
        }
        else {
            console.error('Unsupported data found', componentItem);
            throw new Error('Unsupported data found');
        }
    });
    return strings.join('');
}
function parseComponent(component) {
    return [
        `<!--${escapeHTML(component.getComponentName())}-->`,
        parseComponentItems(component.getVirtualDom()),
        `<!--/${escapeHTML(component.getComponentName())}-->`,
    ].join('');
}
export default function parse(component) {
    component.setup();
    const template = parseComponent(component);
    return template;
}
