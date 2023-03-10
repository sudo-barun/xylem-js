export default function mountComponent(component, element) {
    component.setup();
    component.setupDom();
    component.domNodes().forEach(element_ => {
        element.appendChild(element_);
    });
    component.notifyAfterAttachToDom();
    return () => {
        component.notifyBeforeDetachFromDom();
        component.detachFromDom();
    };
}
