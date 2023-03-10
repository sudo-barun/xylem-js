import createStream from "../core/createStream.js";
import ProxyStream from "../types/ProxyStream.js";

export default
function createStreamOfDomEvent(
	eventTarget: EventTarget,
	eventName: string
): ProxyStream<Event>
{
	return createStream<Event>((emitter) => {
		eventTarget.addEventListener(eventName, emitter);
		return () => {
			eventTarget.removeEventListener(eventName, emitter);
		};
	});
}
