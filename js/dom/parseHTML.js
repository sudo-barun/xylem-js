import CommentComponent from './_internal/CommentComponent.js';
import Component from './Component.js';
import ElementComponent from './_internal/ElementComponent.js';
import ForEachBuilder from './_internal/ForEachBlockBuilder.js';
import IfElseBlockBuilder from './_internal/IfElseBlockBuilder.js';
import isSupplier from '../utilities/isSupplier.js';
import TextComponent from './_internal/TextComponent.js';
function findIndex(predicate) {
    for (let i = 0; i < this.length; i++) {
        if (predicate(this[i], i, this)) {
            return i;
        }
    }
    return -1;
}
export default function parseHTML(arr) {
    let unclosedElements = [];
    let unclosedComment = null;
    let unclosedCommentContent = null;
    let unclosedText = null;
    let unclosedTextContent = null;
    let previousElementWasSelfClosed;
    const children = [];
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
                unclosedComment.textContent(item);
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
                unclosedText.textContent(item);
                unclosedTextContent = item;
            }
        }
        else if (typeof item === 'string') {
            if (selfClosingElementRegex.test(item)) {
                const [, tagName] = selfClosingElementRegex.exec(item);
                const element = new ElementComponent(tagName);
                element.isSelfClosing(true);
                children.push(element);
                previousElementWasSelfClosed = true;
            }
            else if (elementStartRegex.test(item)) {
                const [, tagName] = elementStartRegex.exec(item);
                const element = new ElementComponent(tagName);
                unclosedElements.push(element);
                children.push(element);
                previousElementWasSelfClosed = false;
            }
            else if (elementEndRegex.test(item)) {
                const [, tagName] = elementEndRegex.exec(item);
                const lastIndex = findIndex.call(unclosedElements.reverse(), e => e.tagName() === tagName);
                if (lastIndex >= 0) {
                    const unclosedElement = unclosedElements[lastIndex];
                    if (unclosedElement.tagName() !== tagName) {
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
                const comment = new CommentComponent('');
                unclosedComment = comment;
                children.push(comment);
            }
            else if (commentEndRegex.test(item)) {
                throw new Error(`Comment end marker(-->) found without preceeding comment start marker(<!--).`);
            }
            else if (textStartRegex.test(item)) {
                const text = new TextComponent('');
                unclosedText = text;
                children.push(text);
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
                children.push(new TextComponent(item));
            }
        }
        else if (Array.isArray(item)) {
            if (unclosedElements.length === 0) {
                console.error('No unclosed element found.', item, arr);
                throw new Error('No unclosed element found.');
            }
            if (item.length === 0) {
                console.warn(`Empty array found inside following array at index ${i}.`, arr);
            }
            unclosedElements[unclosedElements.length - 1].children().push(...parseHTML(item));
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
            children.push(item);
        }
        else if (typeof item === 'object') {
            if (isSupplier(item)) {
                const text = new TextComponent(item);
                children.push(text);
            }
            else {
                Object.keys(item).forEach(function (key) {
                    const listenerRegex = /^@([a-zA-Z]+)$/;
                    const getElementOfAttributes = () => {
                        if (previousElementWasSelfClosed) {
                            const child = children[children.length - 1];
                            if (!(child instanceof ElementComponent)) {
                                console.error('Last item is not Element', child);
                                throw Error('Last item is not Element');
                            }
                            return child;
                        }
                        return unclosedElements[unclosedElements.length - 1];
                    };
                    if (listenerRegex.test(key)) {
                        const [, eventName] = listenerRegex.exec(key);
                        const type = typeof item[key];
                        if ((['function', 'object'].indexOf(type) === -1)
                            ||
                                ((type === 'object')
                                    &&
                                        (typeof item[key]['handleEvent'] !== 'function'))) {
                            console.error('Listener must be function or object with "handleEvent" method.');
                            console.error('Listener:', item[key], ' at key: ', key);
                            console.error(`Check following array at index ${i}.`, arr);
                            throw new Error('Listener must be function or object with "handleEvent" method.');
                        }
                        getElementOfAttributes().addListener(eventName, item[key]);
                    }
                    else if (key === '<>') {
                        getElementOfAttributes().elementSubscriber(item[key]);
                    }
                    else if (key === '=') {
                        item[key](getElementOfAttributes());
                    }
                    else {
                        getElementOfAttributes().attributes()[key] = item[key];
                    }
                });
            }
        }
        else {
            children.push(new TextComponent(item));
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
            `Unclosed element found with tagName "${unclosedElements[0].tagName()}".`,
            ' ',
            `Close it with corresponding end tag (</${unclosedElements[0].tagName()}>)`,
            ` or make it self-closing (<${unclosedElements[0].tagName()}/>)`,
            ` if it is a void element.`,
        ].join('');
        console.error(errorMessage, arr);
        throw new Error(errorMessage);
    }
    for (let i = 1; i < children.length; i++) {
        const child = children[i];
        if (child instanceof TextComponent && (children[i - 1] instanceof TextComponent)) {
            children.splice(i, 0, new CommentComponent(''));
            i++;
        }
    }
    return children;
}
;
