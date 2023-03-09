import Component from "./Component.js";
import ComponentItem from "../types/ComponentItem.js";
import Store from "../types/Store.js";

type Attributes = {
	build: () => Array<ComponentItem>,
	isActive$: Store<boolean>,
}

export default
class IfElseBlockItem extends Component<Attributes>
{
	build(attributes: Attributes): ComponentItem[]
	{
		const isActive$ = this.deriveStore(attributes.isActive$);

		isActive$.subscribe(() => {
			this.reload();
		});

		if (isActive$()) {
			return attributes.build.apply(this);
		}

		return [];
	}
}
