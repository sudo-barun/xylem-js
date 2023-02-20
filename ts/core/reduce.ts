import SourceStore from "../types/SourceStore.js";

export default
function reduce<T>(
	sourceStore: SourceStore<T>,
	callback: (oldValue: T, newValue: T) => T,
	newValue: T
): T;

export default
function reduce<T>(
	sourceStore: SourceStore<T>,
	callback: (oldValue: T, newValue?: T) => T,
	newValue?: T
): T;

export default
function reduce<I,O>(
	sourceStore: SourceStore<O>,
	callback: (oldValue: O, newValue: I) => O,
	newValue: I
): O;

export default
function reduce<I,O>(
	sourceStore: SourceStore<O>,
	callback: (oldValue: O, newValue: I) => O,
	newValue: I
): O
{
	return sourceStore(callback(sourceStore(), newValue));
};
