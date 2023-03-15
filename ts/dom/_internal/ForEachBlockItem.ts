import Component from "../Component.js";
import ComponentChildren from "../../types/ComponentChildren.js";
import DataNode from "../../types/DataNode.js";

type Attributes<T> = {
	buildArgs: [item: T, index$: DataNode<number>],
	build: (item: T, index$: DataNode<number>, component: ForEachBlockItem<T>) => ComponentChildren,
}

export default
class ForEachBlockItem<T> extends Component<Attributes<T>>
{
	build(attributes: Attributes<T>): ComponentChildren
	{
		const build = attributes.build;
		return build(...attributes.buildArgs, this);
	}
}
