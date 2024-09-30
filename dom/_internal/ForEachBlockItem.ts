import Component from "../Component.js";
import ComponentChildren from "../../types/ComponentChildren.js";
import Supplier from "../../types/Supplier.js";
import ForEachBuild from "../../types/_internal/ForEachBuild.js";

type Attributes<T> = {
	buildArgs: [item: T, index$: Supplier<number>],
	build: ForEachBuild<T>,
}

export default
class ForEachBlockItem<T> extends Component<Attributes<T>>
{
	build(attributes: Attributes<T>): ComponentChildren
	{
		const build = attributes.build;
		if (typeof build === 'function') {
			return build(...attributes.buildArgs, this);
		} else {
			return build._(...attributes.buildArgs, this);
		}
	}
}
