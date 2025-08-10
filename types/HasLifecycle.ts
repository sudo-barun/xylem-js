import type Stream from "./Stream.js";

export default
interface HasLifecycle
{
	beforeDetachFromDom: Stream<void>,
}
