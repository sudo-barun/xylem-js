import ArrayMutation from "../types/ArrayMutation.js";
import ArrayStore from "../types/ArrayStore.js";
import Comment from "./Comment.js";
import Component from "./Component.js";
import ComponentItem from "../types/ComponentItem.js";
import createStore from "../core/createStore.js";
import Element from "./Element.js";
import ForEachItemBuilder from "../types/ForEachItemBuilder.js";
import push from "../core/push.js";
import splice from "../core/splice.js";
import Store from "../types/Store.js";
import unshift from "../core/unshift.js";

export default
class ForEachBlock<T> extends Component
{
	_array: T[]|Store<T[]>|ArrayStore<T>;
	_build: (item: T, index: Store<number>, array: T[]|Store<T[]>|ArrayStore<T>) => Array<ComponentItem>;
	_placeholder: Comment|null = null;
	_forItems!: Array<ComponentItem[]>;

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
						if (action === push) {
							this._handlePush(item!);
						} else if (action === unshift) {
							this._handleUnshift(item!);
						} else if (action === splice) {
							this._handleSplice(index$!);
						} else {
							console.error('Action not supported', action);
							throw new Error('Action not supported');
						}
					}
				);
				this.beforeDetachFromDom.subscribe(() => unsubscribeMutation());
			}
		}
	}

	_handleUnshift(item: T)
	{
		const vDomFragment = this._buildVDomFragmentForNewlyAddedArrayItem(
			item,
			0
		);
		setupVDomFragment(vDomFragment);

		getFlattenedDomNodesOfVDomFragment(vDomFragment)
		.forEach((node) => {
			if (this._placeholder) {
				this._placeholder.getDomNode().parentNode!.insertBefore(
					node,
					this._placeholder.getDomNode()
				);
				this._placeholder.getDomNode().remove();
				this._virtualDom.splice(
					this._virtualDom.indexOf(this._placeholder), 1
				);
				this._placeholder = null;
			} else {
				const firstNode = this.getFirstNode();
				firstNode!.parentNode!.insertBefore(node, firstNode);
			}
		});
		this._forItems.unshift(vDomFragment);
		this._virtualDom.unshift(...vDomFragment);
	}

	_handlePush(item: T)
	{
		const vDomFragment = this._buildVDomFragmentForNewlyAddedArrayItem(
			item,
			(this._array as ArrayStore<T>).length$() - 1
		);
		setupVDomFragment(vDomFragment);

		getFlattenedDomNodesOfVDomFragment(vDomFragment)
		.forEach((node) => {
			if (this._placeholder) {
				this._placeholder.getDomNode().parentNode!.append(node);
				this._placeholder.getDomNode().remove();
				this._virtualDom.splice(
					this._virtualDom.indexOf(this._placeholder), 1
				);
				this._placeholder = null;
			} else {
				this.getLastNode()!.parentNode!.append(node);
			}
		});
		this._forItems.push(vDomFragment);
		this._virtualDom.push(...vDomFragment);
	}

	_handleSplice(index$: Store<number>)
	{
		if (this._forItems.length === 1) {
			const fallback = this._getFallback();
			fallback.setupDom();
			this._placeholder = fallback;
			this.getFirstNode()?.before(fallback.getDomNode());
			this._virtualDom.push(fallback);
		}

		const removedFragment = this._forItems.splice(index$(), 1);
		removedFragment[0].forEach((componentItem) => {
			const index = this._virtualDom.indexOf(componentItem);
			this._virtualDom.splice(index, 1);
		})
		removedFragment[0].forEach((componentItem) => {
			if (componentItem instanceof Component) {
				componentItem.getDomNodes().forEach((node) => node.remove());
			} else {
				componentItem.getDomNode().remove();
			}
		});
	}
}

function setupVDomFragment(vDomFragment: ComponentItem[])
{
	vDomFragment.forEach(_vDom => {
		if (
			(_vDom instanceof Component)
			||
			(_vDom instanceof Element)
		) {
			_vDom.setup();
		}
	});
	vDomFragment.forEach(_vDom => {
		_vDom.setupDom();
	});
}

function getFlattenedDomNodesOfVDomFragment(vDomFragment: ComponentItem[]): ChildNode[]
{
	return vDomFragment.map(componentItem => {
		if (componentItem instanceof Component) {
			return componentItem.getDomNodes();
		} else {
			return componentItem.getDomNode();
		}
	}).flat();
}
