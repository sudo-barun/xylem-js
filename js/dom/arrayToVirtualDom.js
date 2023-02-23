import Comment from './Comment.js';
import Component from './Component.js';
import Element from './Element.js';
import Text from './Text.js';
import IfBlock from './IfBlock.js';
import ForEachBlock from './ForEachBlock.js';
export default function arrayToVirtualDom(arr) {
    let unclosedElements = [];
    let unclosedComment = null;
    const vNodes = [];
    if (arr.length === 0) {
        throw new Error('Array cannot be empty.');
    }
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (typeof item === 'string') {
            const elementStartRegex = /^<(?<tagName>[0-9a-zA-Z-]+)>$/;
            const elementEndRegex = /^<\/(?<tagName>[0-9a-zA-Z-]+)>$/;
            const commentStartRegex = /<!--/;
            const commentEndRegex = /-->/;
            if (unclosedComment) {
                if (commentEndRegex.test(item)) {
                    unclosedComment = null;
                }
                else {
                    unclosedComment._textContent = item;
                }
            }
            else {
                if (elementStartRegex.test(item)) {
                    const [, tagName] = elementStartRegex.exec(item);
                    const element = new Element(tagName);
                    unclosedElements.push(element);
                    vNodes.push(element);
                }
                else if (elementEndRegex.test(item)) {
                    const [, tagName] = elementEndRegex.exec(item);
                    const lastIndex = unclosedElements.findLastIndex(e => e.tagName === tagName);
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
                else {
                    const partiallyResemblingElementStartRegex = /<(?<tagName>[a-zA-Z]+)/;
                    if (partiallyResemblingElementStartRegex.test(item)) {
                        console.warn(`Text partially resembling start tag found: ${item} . Consider using getter function.`);
                    }
                    const partiallyResemblingElementEndRegex = /<\/(?<tagName>[a-zA-Z]+)/;
                    if (partiallyResemblingElementEndRegex.test(item)) {
                        console.warn(`Text partially resembling end tag found: ${item} . Consider using getter function.`);
                    }
                    vNodes.push(new Text(item));
                }
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
            unclosedElements[unclosedElements.length - 1].children.push(...arrayToVirtualDom(item));
        }
        else if (item instanceof Component) {
            if ((item instanceof IfBlock) && !item.hasEnded()) {
                console.error(`IfBlock was found without ending with "endIf" inside following array at index ${i} : `, arr);
                throw new Error('IfBlock was found without ending with "endIf"');
            }
            if ((item instanceof ForEachBlock) && !item.hasEnded()) {
                console.error(`ForEachBlock was found without ending with "endForEach" inside following array at index ${i} : `, arr);
                throw new Error('ForEachBlock was found without ending with "endForEach"');
            }
            vNodes.push(item);
        }
        else if (typeof item === 'object') {
            Object.keys(item).forEach(function (key) {
                const listenerRegex = /^@(?<event>[a-zA-Z]+)$/;
                const classRegex = /^\.(?<class>[a-zA-Z-]+)$/;
                if (listenerRegex.test(key)) {
                    const [, event] = listenerRegex.exec(key);
                    if (typeof item[key] !== 'function') {
                        throw new Error('listener must be function');
                    }
                    (unclosedElements[unclosedElements.length - 1]).listeners[event] = item[key];
                }
                else if (classRegex.test(key)) {
                    const [, class_] = classRegex.exec(key);
                    unclosedElements[unclosedElements.length - 1].classes[class_] = item[key];
                }
                else if (key === '<>') {
                    unclosedElements[unclosedElements.length - 1].elementStoreSubscriber = item[key];
                }
                else if (key === '=') {
                    item[key](unclosedElements[unclosedElements.length - 1]);
                }
                else {
                    unclosedElements[unclosedElements.length - 1].attributes[key] = item[key];
                }
            });
        }
        else {
            vNodes.push(new Text(item));
        }
    }
    return vNodes;
}
;
