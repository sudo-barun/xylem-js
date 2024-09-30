import Component from "./Component.js";

export default
function mountComponent(component: Component, element: Element)
{
	component.setup();
	component.notifyAfterSetup();
	component.setupDom();
	for (const element_ of component.domNodes()) {
		element.appendChild(element_);
	}
	component.notifyAfterAttachToDom();

	return () => {
		component.notifyBeforeDetachFromDom();
		component.detachFromDom();
	}
}
