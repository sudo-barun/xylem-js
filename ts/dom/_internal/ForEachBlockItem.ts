import ArrayDataNode from "../../types/ArrayDataNode.js";
import Component from "../Component.js";
import ComponentChildren from "../../types/ComponentChildren.js";
import DataNode from "../../types/DataNode.js";

type Attributes<T> = {
	buildArgs: [item: T, index$: DataNode<number>, array: T[]|DataNode<T[]>|ArrayDataNode<T>],
	build: (item: T, index$: DataNode<number>, array: T[]|DataNode<T[]>|ArrayDataNode<T>) => ComponentChildren,
}

export default
class ForEachBlockItem<T> extends Component<Attributes<T>>
{
	build(attributes: Attributes<T>): ComponentChildren
	{
		return attributes.build.apply(this, attributes.buildArgs);
	}
}
