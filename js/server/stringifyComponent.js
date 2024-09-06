import CommentComponent from "../dom/_internal/CommentComponent.js";
import Component from "../dom/Component.js";
import ElementComponent from "../dom/_internal/ElementComponent.js";
import getValue from "../utilities/getValue.js";
import TextComponent from "../dom/_internal/TextComponent.js";
const entities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
};
const specialCharsRegex = /[&<>'"]/g;
function escapeSpecialChars(str) {
    return str.replace(specialCharsRegex, tag => entities[tag]);
}
function stringifyComponentChildren(componentChildren) {
    const strings = componentChildren.map((componentChild) => {
        if (componentChild instanceof TextComponent) {
            return escapeSpecialChars(getValue(componentChild.textContent()));
        }
        else if (componentChild instanceof CommentComponent) {
            return `<!--${getValue(componentChild.textContent())}-->`;
        }
        else if (componentChild instanceof ElementComponent) {
            const attributesString = Object.keys(componentChild.attributes()).reduce((acc, attributeName) => {
                let attributeValue = getValue(componentChild.attributes()[attributeName]);
                acc.push(`${attributeName}="${escapeSpecialChars(attributeValue)}"`);
                return acc;
            }, []).join(' ');
            const tagName = componentChild.tagName();
            const childrenString = stringifyComponentChildren(componentChild.children());
            const tagWithAttributes = attributesString ? [tagName, attributesString].join(' ') : tagName;
            if (componentChild.isSelfClosing()) {
                return `<${tagWithAttributes}/>`;
            }
            return `<${tagWithAttributes}>${childrenString}</${tagName}>`;
        }
        else if (componentChild instanceof Component) {
            return stringifyComponent(componentChild);
        }
        else {
            console.error('Unsupported data found', componentChild);
            throw new Error('Unsupported data found');
        }
    });
    return strings.join('');
}
export default function stringifyComponent(component) {
    return [
        `<!--${escapeSpecialChars(component.getComponentName())}-->`,
        stringifyComponentChildren(component.children()),
        `<!--/${escapeSpecialChars(component.getComponentName())}-->`,
    ].join('');
}
