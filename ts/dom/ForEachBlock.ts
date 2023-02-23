import ArrayMutation from "../types/ArrayMutation.js";
import ArrayStore from "../types/ArrayStore.js";
import Comment from "./Comment.js";
import Component from "./Component.js";
import ComponentItem from "../types/ComponentItem.js";
import createStore from "../core/createStore.js";
import forEachBlockMutation from "./forEachBlockMutation.js";
import ForEachItemBuilder from "../types/ForEachItemBuilder.js";
import Store from "../types/Store.js";

export default
class ForEachBlock<T> extends Component
{
	_array: T[]|Store<T[]>|ArrayStore<T>;
	_build: (item: T, index: Store<number>, array: T[]|Store<T[]>|ArrayStore<T>) => Array<ComponentItem>;
	_placeholder: Comment|null = null;
	_forItems!: Array<ComponentItem[]>;
	_hasEnded: boolean = false;

	constructor(array: any[]|Store<any[]>, build: ForEachItemBuilder<T>)
	{
		super();
		this._array = array;
		this._build = build;
	}

	_getFallback(): Comment
	{
		const commentVNode = new Comment(`For placeholder ${(new Date).toUTCString()}`);
		this._placeholder = commentVNode;
		return commentVNode;
	}

	build(): ComponentItem[]
	{
		const array = this._getArray();

		this._forItems = array.map((value, index, array) => {
			let index$;
			if (this._array instanceof Array) {
				index$ = createStore(index);
			} else if ('index$Array' in this._array) {
				index$ = this._array.index$Array[index];
			} else {
				index$ = createStore(index);
			}
			return this._build.bind(this)(value, index$, array);
		});

		if (array.length === 0) {
			return [this._getFallback()];
		}
		return this._forItems.flat();
	}

	endForEach(): this
	{
		this._hasEnded = true;
		return this;
	}

	hasEnded(): boolean
	{
		return this._hasEnded;
	}

	_getArray(): T[]
	{
		return this._array instanceof Array ? this._array : this._array();
	}

	_buildVDomFragmentForNewlyAddedArrayItem(item: T, index: number)
	{
		return this._build(
			item,
			(this._array as ArrayStore<T>).index$Array[index],
			this._array
		)
	}

	setup(): void
	{
		if (! this.hasEnded()) {
			throw new Error('ForEachBlock was not ended.');
		}

		super.setup();

		if ('subscribe' in this._array) {
			const unsubscribe = this._array.subscribe((array) => {
				super.setup();
				if (this._forItems.length) {
					this._placeholder = null;
				}
			});
			this.beforeDetachFromDom.subscribe(() => unsubscribe());

			if ('mutate' in this._array) {
				const unsubscribeMutation = this._array.mutate.subscribe(
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
}
