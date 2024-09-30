import Store from "../types/Store.js";

export default
function cumulate<T>(
	sourceStore: Store<T>,
	callback: (oldValue: T, newValue: T) => T,
	newValue: T
): T;

export default
function cumulate<T>(
	sourceStore: Store<T>,
	callback: (oldValue: T, newValue?: T) => T,
	newValue?: T
): T;

export default
function cumulate<I,O>(
	sourceStore: Store<O>,
	callback: (oldValue: O, newValue: I) => O,
	newValue: I
): O;

export default
function cumulate<I,O>(
	sourceStore: Store<O>,
	callback: (oldValue: O, newValue: I) => O,
	newValue: I
): O
{
	return sourceStore._(callback(sourceStore._(), newValue));
};
