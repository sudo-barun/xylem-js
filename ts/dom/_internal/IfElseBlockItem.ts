import Component from "../Component.js";
import ComponentChildren from "../../types/ComponentChildren.js";
import DataNode from "../../types/DataNode.js";
import IfElseBuild from "../../types/_internal/IfElseBuild.js";

type Attributes = {
	build: IfElseBuild,
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
			if (typeof build === 'function') {
				return build(this);
			} else {
				return build._(this);
			}
		}

		return [];
	}
}
