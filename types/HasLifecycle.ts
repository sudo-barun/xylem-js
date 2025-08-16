import type Stream from "./Stream.js";

export default
interface HasLifecycle
{
	beforeDetach: Stream<void>,
}
