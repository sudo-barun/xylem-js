import Component from "./Component.js";
import hydrate from "./hydrate.js";

export default
function hydrateComponent(component: Component, nodes: ArrayLike<Node>)
{
	component.setup();
	component.notifyAfterSetup();
	hydrate(component, nodes);
	component.setupDom();
	component.notifyAfterAttachToDom();

	return () => {
		component.notifyBeforeDetachFromDom();
		component.detachFromDom();
	}
}
