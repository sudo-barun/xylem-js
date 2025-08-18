import hydrate from "./hydrate.js";
export default function hydrateComponent(component, startNode) {
    component.setup();
    component.notifyAfterSetup();
    hydrate(component, startNode);
    component.setupDom();
    component.notifyAfterAttach();
    return () => {
        component.notifyBeforeDetach();
        component.detach();
    };
}
