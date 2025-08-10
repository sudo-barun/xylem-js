import type HasLifecycle from "../types/HasLifecycle.js";
import type Stream from "../types/Stream.js";
import type Unsubscriber from "../types/Unsubscriber.js";

export default
class FakeLifecycle implements HasLifecycle
{
	declare beforeDetachFromDom: Stream<void>

	constructor()
	{
		this.beforeDetachFromDom = new FakeLifecycleEvent;
	}
}

class FakeLifecycleEvent implements Stream<void>
{
	subscribe(): Unsubscriber
	{
		return noop;
	}
}

const noop = {
	_: () => {},
};
