import ArrayMutation from "../types/ArrayMutation.js";
import ArrayStore from "../types/ArrayStore.js";
import Comment from "./Comment.js";
import Component from "./Component.js";
import ComponentItem from "../types/ComponentItem.js";
import createStore from "../core/createStore.js";
import ForEachBlockItem from "./ForEachBlockItem.js";
import forEachBlockMutation from "./forEachBlockMutation.js";
import Store from "../types/Store.js";

type Attributes<T> = {
	array: T[]|Store<T[]>|ArrayStore<T>;
	build: (item: T, index: Store<number>, array: T[]|Store<T[]>|ArrayStore<T>) => Array<ComponentItem>;
};

function getArray<T>(attributes: Attributes<T>): T[]
{
	return attributes.array instanceof Array ? attributes.array : attributes.array();
}

export default
class ForEachBlock<T> extends Component<Attributes<T>>
{
	_placeholder: Comment|null = null;

	_getFallback(): Comment
	{
		const commentVNode = new Comment(`For placeholder ${(new Date).toUTCString()}`);
		this._placeholder = commentVNode;
		return commentVNode;
	}

	build(attributes: Attributes<T>): ComponentItem[]
	{
		const array = getArray(attributes);

		const _forItems = array.map((value, index, array) => {
			let index$;
			if (attributes.array instanceof Array) {
				index$ = createStore(index);
			} else if ('index$Array' in attributes.array) {
				index$ = attributes.array.index$Array[index];
			} else {
				index$ = createStore(index);
			}
			return new ForEachBlockItem<T>({
				build: attributes.build,
				buildArgs: [value, index$, array],
			});
		});

		if (array.length === 0) {
			return [this._getFallback()];
		}
		return _forItems;
	}

	_buildVDomFragmentForNewlyAddedArrayItem(item: T, index: number): ForEachBlockItem<T>
	{
		return new ForEachBlockItem<T>({
			build: this._attributes.build,
			buildArgs: [
				item,
				(this._attributes.array as ArrayStore<T>).index$Array[index],
				this._attributes.array,
			],
		});
	}

	setup(): void
	{
		super.setup();

		if ('subscribe' in this._attributes.array) {
			const unsubscribe = this._attributes.array.subscribe((array) => {
				super.setup();
				if (this._virtualDom.length) {
					this._placeholder = null;
				}
			});
			this.beforeDetachFromDom.subscribe(() => unsubscribe());

			if ('mutate' in this._attributes.array) {
				const unsubscribeMutation = this._attributes.array.mutate.subscribe(
					({action, item, index$}: ArrayMutation<T>) => {
						const handler = forEachBlockMutation.getHandler(action);
						if (handler === null) {
							console.error('Array was mutated with action but no handler found for the action.', action);
							throw new Error('Array was mutated with action but no handler found for the action.');
						}
						handler.call(this, {
							item,
							index$,
						});
					}
				);
				this.beforeDetachFromDom.subscribe(() => unsubscribeMutation());
			}
		}
	}

	getLength(): number
	{
		if (this._attributes.array instanceof Array) {
			return this._attributes.array.length;
		} else {
			return this._attributes.array().length;
		}
	}
}
