import createStream from "../core/createStream.js";
import type Emitter from "../types/Emitter.js";
import type Stream from "../types/Stream.js";
import type Unsubscriber from "../types/Unsubscriber.js";

export default
function createStreamOfDomEvent(
	eventTarget: EventTarget,
	eventName: string
): Stream<Event>
{
	return createStream<Event>((emitter) => {
		const eventListener = new EventListener(emitter);
		eventTarget.addEventListener(eventName, eventListener);
		return new EventListenerRemover(eventTarget, eventName, eventListener);
	});
}

class EventListener implements EventListenerObject
{
	declare _emitter: Emitter<Event>;

	constructor(emitter: Emitter<Event>)
	{
		this._emitter = emitter;
	}

	handleEvent(event: Event): void
	{
		this._emitter._(event);
	}
}

class EventListenerRemover implements Unsubscriber
{
	declare _eventTarget: EventTarget;
	declare _eventName: string;
	declare _eventListener: EventListener;

	constructor(eventTarget: EventTarget, eventName: string, eventListener: EventListener)
	{
		this._eventTarget = eventTarget;
		this._eventName = eventName;
		this._eventListener = eventListener;
	}

	_(): void
	{
		this._eventTarget.removeEventListener(this._eventName, this._eventListener);
	}
}
