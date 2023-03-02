import Component from "./Component.js";

export default
function mount(component: Component, element: Element) {
	component.setup();
	component.setupDom();
	component.getDomNodes().forEach(element_ => {
		element.appendChild(element_);
	});
	component.notifyAfterAttachToDom();
}
