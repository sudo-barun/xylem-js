import CommentComponent from "../dom/_internal/CommentComponent.js";
import Component from "../dom/Component.js";
import ElementComponent from "../dom/_internal/ElementComponent.js";
import getValue from "../utilities/getValue.js";
import TextComponent from "../dom/_internal/TextComponent.js";
import ComponentChildren from "../types/ComponentChildren.js";
import RawHTML from "../dom/RawHTML.js";

const entities = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	"'": '&#39;',
	'"': '&quot;'
};

const specialCharsRegex = /[&<>'"]/g;

function escapeSpecialChars(str: string) {
	return str.replace(
		specialCharsRegex,
		tag => entities[tag as keyof typeof entities]
	);
}

function stringifyComponentChildren(componentChildren: ComponentChildren): string
{
	const strings: string[] = componentChildren.map((componentChild) => {
		if (componentChild instanceof TextComponent) {

			const value = getValue(componentChild.textContent());
			if (typeof value === 'string') {
				return escapeSpecialChars(value);
			}
			return value;

		} else if (componentChild instanceof CommentComponent) {

			return `<!--${getValue(componentChild.textContent())}-->`;

		} else if (componentChild instanceof ElementComponent) {

			const attributesString = Object.keys(componentChild.attributes()).reduce((acc, attributeName) => {
				let attributeValue = getValue(componentChild.attributes()[attributeName]);
				if (typeof attributeValue === 'string') {
					acc.push(`${attributeName}="${escapeSpecialChars(attributeValue)}"`);
				} else if (typeof attributeValue === 'boolean') {
					if (attributeValue) {
						acc.push(`${attributeName}`);
					}
				} else {
					acc.push(`${attributeName}="${attributeValue}"`);
				}
				return acc;
			}, [] as string[]).join(' ');

			const tagName = componentChild.tagName();
			const childrenString = stringifyComponentChildren(componentChild.children());
			const tagWithAttributes = attributesString ? [tagName, attributesString].join(' ') : tagName;
			if (componentChild.isSelfClosing()) {
				return `<${tagWithAttributes}/>`;
			}
			return `<${tagWithAttributes}>${childrenString}</${tagName}>`;

		} else if (componentChild instanceof Component) {

			if (componentChild instanceof RawHTML) {
				return [
					`<!--${escapeSpecialChars(componentChild.getComponentName())}-->`,
					componentChild.getContent(),
					`<!--/${escapeSpecialChars(componentChild.getComponentName())}-->`,
				].join('');
			}

			return stringifyComponent(componentChild);

		} else {

			console.error('Unsupported data found', componentChild);
			throw new Error('Unsupported data found');

		}
	});

	return strings.join('');
}

export default
function stringifyComponent(component: Component): string
{
	return [
		`<!--${escapeSpecialChars(component.getComponentName())}-->`,
		stringifyComponentChildren(component.children()),
		`<!--/${escapeSpecialChars(component.getComponentName())}-->`,
	].join('');
}
