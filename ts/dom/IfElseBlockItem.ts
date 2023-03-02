import Comment from "./Comment.js";
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
	setup(): void
	{
		super.setup();

		const unsubscribe = this._attributes.isActive$.subscribe(() => {
			super.setup();
			this.notifyAfterAttachToDom();
		});
		this.beforeDetachFromDom.subscribe(unsubscribe);
	}

	build(attributes: Attributes): ComponentItem[]
	{
		if (attributes.isActive$()) {
			return attributes.build.apply(this);
		}

		const commentVNode = new Comment(`If placeholder ${(new Date).toUTCString()}`);

		return [commentVNode];
	}
}
