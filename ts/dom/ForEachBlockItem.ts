import ArrayStore from "../types/ArrayStore.js";
import Component from "./Component.js";
import ComponentItem from "../types/ComponentItem.js";
import Store from "../types/Store.js";

type Attributes<T> = {
	buildArgs: [item: T, index$: Store<number>, array: T[]|Store<T[]>|ArrayStore<T>],
	build: (item: T, index$: Store<number>, array: T[]|Store<T[]>|ArrayStore<T>) => Array<ComponentItem>,
}

export default
class ForEachBlockItem<T> extends Component<Attributes<T>>
{
	build(attributes: Attributes<T>): ComponentItem[]
	{
		return attributes.build.apply(this, attributes.buildArgs);
	}
}
