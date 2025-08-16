export default function mountComponent(component, node, position = 'beforeend') {
    component.setup();
    component.notifyAfterSetup();
    component.setupDom();
    if (position === 'beforeend') {
        for (const element_ of component.domNodes()) {
            node.appendChild(element_);
        }
    }
    else if (position === 'afterbegin') {
        const firstChild = node.firstChild;
        for (const element_ of component.domNodes()) {
            node.insertBefore(element_, firstChild);
        }
    }
    else if (position === 'afterend') {
        let lastInsertedElement = node;
        const componentNodes = component.domNodes();
        for (let i = 0; i < componentNodes.length; i++) {
            node.parentNode.insertBefore(componentNodes[i], lastInsertedElement.nextSibling);
            lastInsertedElement = lastInsertedElement.nextSibling;
        }
    }
    else if (position === 'beforebegin') {
        for (const element_ of component.domNodes()) {
            node.parentNode.insertBefore(element_, node);
        }
    }
    component.notifyAfterAttachToDom();
    return () => {
        component.notifyBeforeDetachFromDom();
        component.detachFromDom();
    };
}
