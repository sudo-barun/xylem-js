import createProxyStore from "../core/createProxyStore.js";
import createStream from "../core/createStream.js";
function styleToString(styleDefinitions) {
    return Object.keys(styleDefinitions).reduce((acc, property) => {
        const definition = styleDefinitions[property];
        let value = definition instanceof Function ? definition() : definition;
        acc.push(`${property}:${value}`);
        return acc;
    }, []).join(';');
}
export default function styleAttr(styleDefinitions) {
    const getter = () => styleToString(styleDefinitions);
    const stream = createStream();
    Object.keys(styleDefinitions).forEach(property => {
        const definition = styleDefinitions[property];
        if ((definition instanceof Function) && ('subscribe' in definition)) {
            definition.subscribe((value) => {
                stream(styleToString(styleDefinitions));
            });
        }
    });
    return createProxyStore(getter, stream);
}
