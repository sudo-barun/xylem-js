import hydrate from "./hydrate.js";
export default function hydrateComponent(component, nodes) {
    component.setup();
    component.notifyAfterSetup();
    hydrate(component, nodes);
    component.setupDom();
    component.notifyAfterAttachToDom();
    return () => {
        component.notifyBeforeDetachFromDom();
        component.detachFromDom();
    };
}
