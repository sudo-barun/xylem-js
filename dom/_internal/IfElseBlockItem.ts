import Component from "../Component.js";
import type ComponentChildren from "../../types/ComponentChildren.js";
import type Supplier from "../../types/Supplier.js";
import type IfElseBuild from "../../types/_internal/IfElseBuild.js";

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
				return build.call(this, this);
			} else {
				return build._(this);
			}
		}

		return [];
	}
}
