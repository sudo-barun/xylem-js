import Component from "../Component.js";
import ComponentChildren from "../../types/ComponentChildren.js";
import Supplier from "../../types/Supplier.js";
import IfElseBuild from "../../types/_internal/IfElseBuild.js";

type Attributes = {
	build: IfElseBuild,
	isActive$: Supplier<boolean>,
}

export default
class IfElseBlockItem extends Component<Attributes>
{
	build(attributes: Attributes): ComponentChildren
	{
		const isActive$ = this.bindSupplier(attributes.isActive$);

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
