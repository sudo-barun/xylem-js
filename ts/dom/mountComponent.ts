import Component from "./Component.js";

export default
function mountComponent(component: Component, element: Element)
{
	component.setup();
	component.setupDom();
	component.domNodes().forEach(element_ => {
		element.appendChild(element_);
	});
	component.notifyAfterAttachToDom();

	return () => {
		component.notifyBeforeDetachFromDom();
		component.detachFromDom();
	}
}
