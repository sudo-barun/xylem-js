import createProxyStream from "../core/createProxyStream.js";
import ProxyStream from "../types/ProxyStream.js";

export default
function createStreamOfDomEvent(
	eventTarget: EventTarget,
	eventName: string
): ProxyStream<Event>
{
	return createProxyStream<Event>((sourceStream) => {
		eventTarget.addEventListener(eventName, sourceStream);
		return () => {
			document.removeEventListener(eventName, sourceStream);
		};
	});
}
