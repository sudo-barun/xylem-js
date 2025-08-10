import type Component from "./Component.js";
import hydrate from "./hydrate.js";

export default
function hydrateComponent(component: Component, startNode: ChildNode)
{
	component.setup();
	component.notifyAfterSetup();
	hydrate(component, startNode);
	component.setupDom();
	component.notifyAfterAttachToDom();

	return () => {
		component.notifyBeforeDetachFromDom();
		component.detachFromDom();
	}
}
