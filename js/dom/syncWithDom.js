export default function syncWithDom(element, node) {
    // TODO: handle other classes
    element.setDomNode(node);
    element.setup();
    element.setupDom();
}
