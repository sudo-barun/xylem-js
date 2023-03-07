import Comment from './Comment.js';
import Component from './Component.js';
import createAttributeFunction from './createAttributeFunction.js';
import Element from './Element.js';
import setAttribute from './setAttribute.js';
import Text from './Text.js';
export default function virtualDomToDom(vNodes) {
    const nodes = [];
    for (let i = 0; i < vNodes.length; i++) {
        const vNode = vNodes[i];
        if (vNode instanceof Element) {
            vNode.setup();
            vNode.setupDom();
            const element = vNode.getDomNode();
            Object.keys(vNode.attributes).forEach(function (attr) {
                if (attr === '()') {
                    vNode.attributes[attr](element, attr);
                }
                else if (typeof vNode.attributes[attr] === 'function') {
                    createAttributeFunction(vNode.attributes[attr])(element, attr);
                }
                else {
                    setAttribute(element, attr, vNode.attributes[attr]);
                }
            });
            // createFunctionToSetClassList(vNode.classes)(element);
            Object.keys(vNode.listeners).forEach(function (event) {
                element.addEventListener(event, vNode.listeners[event]);
            });
            element.append(...virtualDomToDom(vNode.children));
            nodes.push(element);
        }
        else if (vNode instanceof Text) {
            vNode.setupDom();
            nodes.push(vNode.getDomNode());
            vNode.afterAttachToDom();
        }
        else if (vNode instanceof Comment) {
            vNode.setupDom();
            nodes.push(vNode.getDomNode());
        }
        else if (vNode instanceof Component) {
            vNode.setup();
            vNode.setupDom();
            nodes.push(...vNode.getDomNodes());
            vNode._notifyAfterAttachToDom();
        }
    }
    return nodes;
}
;
