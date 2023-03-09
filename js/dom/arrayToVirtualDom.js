import Comment from './Comment.js';
import Component from './Component.js';
import Element from './Element.js';
import ForEachBuilder from './ForEachBlockBuilder.js';
import IfElseBlockBuilder from './IfElseBlockBuilder.js';
import Text from './Text.js';
function findIndex(predicate) {
    for (let i = 0; i < this.length; i++) {
        if (predicate(this[i], i, this)) {
            return i;
        }
    }
    return -1;
}
export default function arrayToVirtualDom(arr) {
    let unclosedElements = [];
    let unclosedComment = null;
    let unclosedCommentContent = null;
    let unclosedText = null;
    let unclosedTextContent = null;
    let previousElementWasSelfClosed;
    const vNodes = [];
    const elementStartRegex = /^<([0-9a-zA-Z-]+)>$/;
    const elementEndRegex = /^<\/([0-9a-zA-Z-]+)>$/;
    const selfClosingElementRegex = /^<([0-9a-zA-Z-]+)\/>$/;
    const commentStartRegex = /^<!--$/;
    const commentEndRegex = /^-->$/;
    const textStartRegex = /^<>$/;
    const textEndRegex = /^<\/>$/;
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (unclosedComment) {
            if (commentEndRegex.test(item)) {
                if (unclosedCommentContent === null) {
                    console.error(`Comment end marker found without any content. Check following array at index ${i} : `, arr);
                    throw new Error('Comment end marker found without any content.');
                }
                unclosedComment = null;
                unclosedCommentContent = null;
            }
            else {
                if (unclosedCommentContent !== null) {
                    console.error(`Comment content already defined inside comment markers. Check following array at index ${i} : `, arr);
                    throw new Error('Comment content already defined inside comment markers.');
                }
                unclosedComment.setTextContent(item);
                unclosedCommentContent = item;
            }
        }
        else if (unclosedText) {
            if (textEndRegex.test(item)) {
                if (unclosedTextContent === null) {
                    console.error(`Text end marker found without any content. Check following array at index ${i} : `, arr);
                    throw new Error('Text end marker found without any content.');
                }
                unclosedText = null;
                unclosedTextContent = null;
            }
            else {
                if (unclosedTextContent !== null) {
                    console.error(`Text content already defined inside text markers. Check following array at index ${i} : `, arr);
                    throw new Error('Text content already defined inside text markers.');
                }
                unclosedText.setTextContent(item);
                unclosedTextContent = item;
            }
        }
        else if (typeof item === 'string') {
            if (selfClosingElementRegex.test(item)) {
                const [, tagName] = selfClosingElementRegex.exec(item);
                const element = new Element(tagName);
                element.isSelfClosing(true);
                vNodes.push(element);
                previousElementWasSelfClosed = true;
            }
            else if (elementStartRegex.test(item)) {
                const [, tagName] = elementStartRegex.exec(item);
                const element = new Element(tagName);
                unclosedElements.push(element);
                vNodes.push(element);
                previousElementWasSelfClosed = false;
            }
            else if (elementEndRegex.test(item)) {
                const [, tagName] = elementEndRegex.exec(item);
                const lastIndex = findIndex.call(unclosedElements.reverse(), e => e.tagName === tagName);
                if (lastIndex >= 0) {
                    const unclosedElement = unclosedElements[lastIndex];
                    if (unclosedElement.tagName !== tagName) {
                        throw new Error(`No matching opening tag found for </${tagName}>`);
                    }
                    unclosedElements.splice(lastIndex);
                }
                else {
                    console.error(`Closing tag "${tagName}" does not match any unclosed tag. Source:`, arr);
                    throw new Error(`Closing tag "${tagName}" does not match any unclosed tag.`);
                }
            }
            else if (commentStartRegex.test(item)) {
                const comment = new Comment('');
                unclosedComment = comment;
                vNodes.push(comment);
            }
            else if (commentEndRegex.test(item)) {
                throw new Error(`Comment end marker(-->) found without preceeding comment start marker(<!--).`);
            }
            else if (textStartRegex.test(item)) {
                const text = new Text('');
                unclosedText = text;
                vNodes.push(text);
            }
            else if (textEndRegex.test(item)) {
                throw new Error(`Text end marker(</>) found without preceeding text start marker(<>).`);
            }
            else {
                const partiallyResemblingElementStartRegex = /<([a-zA-Z]+)/;
                if (partiallyResemblingElementStartRegex.test(item)) {
                    console.warn(`Text partially resembling start tag found: ${item} . Consider using text markers.`);
                }
                const partiallyResemblingElementEndRegex = /<\/([a-zA-Z]+)/;
                if (partiallyResemblingElementEndRegex.test(item)) {
                    console.warn(`Text partially resembling end tag found: ${item} . Consider using text markers.`);
                }
                vNodes.push(new Text(item));
            }
        }
        else if (typeof item === 'function') {
            const text = new Text(item);
            vNodes.push(text);
        }
        else if (Array.isArray(item)) {
            if (unclosedElements.length === 0) {
                console.error('No unclosed element found.', item, arr);
                throw new Error('No unclosed element found.');
            }
            if (item.length === 0) {
                console.warn(`Empty array found inside following array at index ${i}.`, arr);
            }
            unclosedElements[unclosedElements.length - 1].children.push(...arrayToVirtualDom(item));
        }
        else if (item instanceof IfElseBlockBuilder) {
            console.error(`IfBlockBuilder was found. Close IfBlockBuilder with "endIf" inside following array at index ${i} : `, arr);
            throw new Error('IfBlockBuilder was found. Close IfBlockBuilder with "endIf"');
        }
        else if (item instanceof ForEachBuilder) {
            console.error(`ForEachBlockBuilder was found. Close ForEachBlockBuilder with "endForEach" inside following array at index ${i} : `, arr);
            throw new Error('ForEachBlockBuilder was found. Close ForEachBlockBuilder with "endForEach"');
        }
        else if (item instanceof Component) {
            vNodes.push(item);
        }
        else if (typeof item === 'object') {
            Object.keys(item).forEach(function (key) {
                const listenerRegex = /^@([a-zA-Z]+)$/;
                const getElementOfAttributes = () => {
                    if (previousElementWasSelfClosed) {
                        const vNode = vNodes[vNodes.length - 1];
                        if (!(vNode instanceof Element)) {
                            console.log('Last item is not Element', vNode);
                            throw Error('Last item is not Element');
                        }
                        return vNode;
                    }
                    return unclosedElements[unclosedElements.length - 1];
                };
                if (listenerRegex.test(key)) {
                    const [, event] = listenerRegex.exec(key);
                    if (typeof item[key] !== 'function') {
                        throw new Error('listener must be function');
                    }
                    getElementOfAttributes().listeners[event] = item[key];
                }
                else if (key === '<>') {
                    getElementOfAttributes().elementStoreSubscriber = item[key];
                }
                else if (key === '=') {
                    item[key](getElementOfAttributes());
                }
                else {
                    getElementOfAttributes().attributes[key] = item[key];
                }
            });
        }
        else {
            vNodes.push(new Text(item));
        }
    }
    if (unclosedComment) {
        console.error('Unclosed comment found', arr);
        throw new Error('Unclosed comment found');
    }
    if (unclosedText) {
        console.error('Unclosed text found', arr);
        throw new Error('Unclosed text found');
    }
    if (unclosedElements.length) {
        const errorMessage = [
            `Unclosed element found with tagName "${unclosedElements[0].tagName}".`,
            ' ',
            `Close it with corresponding end tag (</${unclosedElements[0].tagName}>)`,
            ` or make it self-closing (<${unclosedElements[0].tagName}/>)`,
            ` if it is a void element.`,
        ].join('');
        console.error(errorMessage, arr);
        throw new Error(errorMessage);
    }
    return vNodes;
}
;
