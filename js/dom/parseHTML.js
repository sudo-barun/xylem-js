import CommentComponent from './_internal/CommentComponent.js';
import Component from './Component.js';
import ElementComponent from './_internal/ElementComponent.js';
import ForEachBuilder from './_internal/ForEachBlockBuilder.js';
import IfElseBlockBuilder from './_internal/IfElseBlockBuilder.js';
import isSupplier from '../utilities/isSupplier.js';
import TextComponent from './_internal/TextComponent.js';
const elementStartRegex = /^<([0-9a-zA-Z-]+)>$/;
const elementEndRegex = /^<\/([0-9a-zA-Z-]+)>$/;
const selfClosingElementRegex = /^<([0-9a-zA-Z-]+)\/>$/;
const commentStartRegex = /^<!--$/;
const commentEndRegex = /^-->$/;
const textStartRegex = /^<>$/;
const textEndRegex = /^<\/>$/;
export default function parseHTML(arr) {
    let unclosedElement = null;
    let unclosedComment = null;
    let unclosedCommentContentFound = false;
    let unclosedText = null;
    let unclosedTextContentFound = false;
    let previousElementWasSelfClosed = false;
    const children = [];
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (unclosedComment) {
            if (unclosedCommentContentFound === false) {
                unclosedComment.textContent(item);
                unclosedCommentContentFound = true;
            }
            else {
                if (commentEndRegex.test(item)) {
                    unclosedComment = null;
                    unclosedCommentContentFound = false;
                }
                else {
                    console.error(`Comment content already defined inside comment markers. Check following array at index ${i} : `, arr);
                    throw new Error('Comment content already defined inside comment markers.');
                }
            }
        }
        else if (unclosedText) {
            if (unclosedTextContentFound === false) {
                unclosedText.textContent(item);
                unclosedTextContentFound = true;
            }
            else {
                if (textEndRegex.test(item)) {
                    unclosedText = null;
                    unclosedTextContentFound = false;
                }
                else {
                    console.error(`Text content already defined inside text markers. Check following array at index ${i} : `, arr);
                    throw new Error('Text content already defined inside text markers.');
                }
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
                if (unclosedElement !== null) {
                    console.error(`New element "<${tagName}>" found but unclosed element "<${unclosedElement.tagName()}>" exists.`);
                    console.error(`Check following array at index ${i}.`, arr);
                    throw new Error(`New element "<${tagName}>" found but unclosed element "<${unclosedElement.tagName()}>" exists.`);
                }
                const element = new ElementComponent(tagName);
                unclosedElement = element;
                children.push(element);
                previousElementWasSelfClosed = false;
            }
            else if (elementEndRegex.test(item)) {
                const [, tagName] = elementEndRegex.exec(item);
                if (unclosedElement === null) {
                    console.error(`Closing tag "</${tagName}>" found without unclosed element.`);
                    console.error(`Check following array at index ${i}.`, arr);
                    throw new Error(`Closing tag "</${tagName}>" found without unclosed element.`);
                }
                if (unclosedElement.tagName() !== tagName) {
                    console.error(`Closing tag "</${tagName}>" does not match unclosed tag "<${unclosedElement.tagName()}>".`);
                    console.error(`Check following array at index ${i}.`, arr);
                    throw new Error(`Closing tag "</${tagName}>" does not match unclosed tag "<${unclosedElement.tagName()}>".`);
                }
                unclosedElement = null;
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
                    console.warn(`Text partially resembling start tag found: ${item} . Consider using text markers: <>${item}</>.`);
                }
                const partiallyResemblingElementEndRegex = /<\/([a-zA-Z]+)/;
                if (partiallyResemblingElementEndRegex.test(item)) {
                    console.warn(`Text partially resembling end tag found: ${item} . Consider using text markers: <>${item}</>.`);
                }
                children.push(new TextComponent(item));
            }
        }
        else if (Array.isArray(item)) {
            if (unclosedElement === null) {
                console.error('No unclosed element found.', item, arr);
                throw new Error('No unclosed element found.');
            }
            if (item.length === 0) {
                console.warn(`Empty array found inside following array at index ${i}.`, arr);
            }
            unclosedElement.children().push(...parseHTML(item));
        }
        else if (item instanceof IfElseBlockBuilder) {
            console.error(`"if_()" is not ended with "endIf()" inside following array at index ${i} : `, arr);
            throw new Error('"if_()" is not ended with "endIf()"');
        }
        else if (item instanceof ForEachBuilder) {
            console.error(`"forEach()" is not ended with "endForEach()" inside following array at index ${i} : `, arr);
            throw new Error('"forEach()" is not ended with "endForEach()"');
        }
        else if (item instanceof Component
            || item instanceof ElementComponent
            || item instanceof TextComponent
            || item instanceof CommentComponent) {
            children.push(item);
        }
        else if (typeof item === 'object' && item !== null) {
            if (isSupplier(item)) {
                const text = new TextComponent(item);
                children.push(text);
            }
            else {
                if (typeof arr[i - 1] === 'object' && arr[i - 1] !== null) {
                    console.error(`Attributes already declared.`);
                    console.error(`Check following array at index ${i}.`, arr);
                    throw new Error(`Attributes already declared.`);
                }
                let elementOfAttributes;
                if (previousElementWasSelfClosed) {
                    const child = children[children.length - 1];
                    if (!(child instanceof ElementComponent)) {
                        console.error('Last item is not Element', child);
                        throw Error('Last item is not Element');
                    }
                    elementOfAttributes = child;
                }
                else if (unclosedElement !== null) {
                    elementOfAttributes = unclosedElement;
                }
                else {
                    console.error(`No preceeding element found.`);
                    console.error(`Check following array at index ${i}.`, arr);
                    throw new Error(`No preceeding element found.`);
                }
                for (const key of Object.keys(item)) {
                    const listenerRegex = /^@(.*)$/;
                    if (listenerRegex.test(key)) {
                        const [, eventName] = listenerRegex.exec(key);
                        const type = typeof item[key];
                        if ((['function', 'object'].indexOf(type) === -1)
                            ||
                                (type === 'object' && item[key] === null)
                            ||
                                ((type === 'object' && item[key] !== null)
                                    &&
                                        (typeof item[key]['handleEvent'] !== 'function'))) {
                            console.error('Listener must be function or object with "handleEvent" method.');
                            console.error('Listener:', item[key], ' at key: ', key);
                            console.error(`Check following array at index ${i}.`, arr);
                            throw new Error('Listener must be function or object with "handleEvent" method.');
                        }
                        elementOfAttributes.addListener(eventName, item[key]);
                    }
                    else if (key === '<>') {
                        elementOfAttributes.elementSubscriber(item[key]);
                    }
                    else if (key === '=') {
                        item[key](elementOfAttributes);
                    }
                    else {
                        elementOfAttributes.attributes()[key] = item[key];
                    }
                }
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
    if (unclosedElement !== null) {
        const errorMessage = [
            `Unclosed element found with tagName "${unclosedElement.tagName()}".`,
            ' ',
            `Close it with corresponding end tag (</${unclosedElement.tagName()}>)`,
            ` or make it self-closing (<${unclosedElement.tagName()}/>)`,
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
