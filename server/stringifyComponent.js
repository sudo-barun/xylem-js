import CommentComponent from "../dom/_internal/CommentComponent.js";
import Component from "../dom/Component.js";
import ElementComponent, { attrClass, attrStyle } from "../dom/_internal/ElementComponent.js";
import getValue from "../utilities/getValue.js";
import TextComponent from "../dom/_internal/TextComponent.js";
import RawHTML from "../dom/RawHTML.js";
import isSupplier from "../utilities/isSupplier.js";
import FakeLifecycle from "../utilities/FakeLifecycle.js";
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
const voidElementsInHTML = [
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr',
].reduce((acc, el) => {
    acc[el] = true;
    return acc;
}, Object.create(null));
function stringifyComponentChildren(componentChildren) {
    const strings = componentChildren.map((componentChild) => {
        if (componentChild instanceof TextComponent) {
            const value = getValue(componentChild.textContent());
            if (value === '' || value === null || value === undefined) {
                return '<!---->';
            }
            if (typeof value === 'string') {
                return escapeSpecialChars(value);
            }
            return value;
        }
        else if (componentChild instanceof CommentComponent) {
            return `<!--${getValue(componentChild.textContent())}-->`;
        }
        else if (componentChild instanceof ElementComponent) {
            const attributesString = Object.keys(componentChild.attributes()).reduce((acc, attributeName) => {
                let attributeValue = componentChild.attributes()[attributeName];
                let attributeValuePrimitive;
                if (isSupplier(attributeValue)) {
                    attributeValuePrimitive = attributeValue._();
                }
                else if (attributeName === 'class' && typeof attributeValue === 'object' && attributeValue !== null) {
                    attributeValuePrimitive = attrClass(new FakeLifecycle, attributeValue)._();
                }
                else if (attributeName === 'style' && typeof attributeValue === 'object' && attributeValue !== null) {
                    attributeValuePrimitive = attrStyle(new FakeLifecycle, attributeValue)._();
                }
                else {
                    attributeValuePrimitive = attributeValue;
                }
                if (typeof attributeValuePrimitive === 'boolean') {
                    if (attributeValuePrimitive) {
                        acc.push(`${attributeName}`);
                    }
                }
                else {
                    acc.push(`${attributeName}="${escapeSpecialChars(String(attributeValuePrimitive))}"`);
                }
                return acc;
            }, []).join(' ');
            const tagName = componentChild.tagName();
            const childrenString = stringifyComponentChildren(componentChild.children());
            const tagWithAttributes = attributesString ? [tagName, attributesString].join(' ') : tagName;
            if (componentChild.getNamespace() === 'html' && componentChild.tagName().toLowerCase() in voidElementsInHTML) {
                return `<${tagWithAttributes}/>`;
            }
            return `<${tagWithAttributes}>${childrenString}</${tagName}>`;
        }
        else if (componentChild instanceof Component) {
            if (componentChild instanceof RawHTML) {
                return [
                    `<!--${escapeSpecialChars(componentChild.getComponentName())}-->`,
                    componentChild.getContent(),
                    `<!--/${escapeSpecialChars(componentChild.getComponentName())}-->`,
                ].join('');
            }
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
