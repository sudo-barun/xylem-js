export default function mount(component, element) {
    component.setup();
    component.setupDom();
    component.getDomNodes().forEach(element_ => {
        element.appendChild(element_);
    });
    component.notifyAfterAttachToDom();
}
