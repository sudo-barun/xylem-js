import hydrate from "./hydrate.js";
export default function hydrateComponent(component, startNode) {
    component.setup();
    component.notifyAfterSetup();
    hydrate(component, startNode);
    component.setupDom();
    component.notifyAfterAttachToDom();
    return () => {
        component.notifyBeforeDetachFromDom();
        component.detachFromDom();
    };
}
