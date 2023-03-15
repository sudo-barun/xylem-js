import Component from "../Component.js";
import ComponentChildren from "../../types/ComponentChildren.js";
import DataNode from "../../types/DataNode.js";

type Attributes = {
	build: (component: IfElseBlockItem) => ComponentChildren,
	isActive$: DataNode<boolean>,
}

export default
class IfElseBlockItem extends Component<Attributes>
{
	build(attributes: Attributes): ComponentChildren
	{
		const isActive$ = this.bindDataNode(attributes.isActive$);

		isActive$.subscribe(() => {
			this.reload();
		});

		if (isActive$._()) {
			const build = attributes.build;
			return build(this);
		}

		return [];
	}
}
