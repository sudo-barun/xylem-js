import Comment from "./Comment.js";
import Component from "./Component.js";
import ComponentItem from "../types/ComponentItem.js";
import createStore from "../core/createStore.js";
import getValue from "../utilities/getValue.js";
import map from "../core/map.js";
import Store from "../types/Store.js";

type Condition = {condition: boolean|Store<boolean>, build: () => Array<ComponentItem>};

export default
class IfBlock extends Component
{
	_ifConditions: Array<Condition> = [];
	_hasElse: boolean = false;
	_activeBlockIndex: number = -1;
	_hasEnded: boolean = false;

	constructor(condition: Store<any>, build: () => Array<ComponentItem>)
	{
		super();
		this._ifConditions.push({
			condition: map<any,boolean>(this.deriveStore(condition), Boolean),
			build,
		});
	}

	elseIf(condition: Store<any>, build: () => Array<ComponentItem>): this
	{
		if (this._hasEnded) {
			throw new Error('IfBlock has already ended');
		}
		if (this._hasElse) {
			throw new Error('Else block has already been set');
		}

		this._ifConditions.push({
			condition: map<any,boolean>(this.deriveStore(condition), Boolean),
			build,
		});

		return this;
	}

	else(build: () => Array<ComponentItem>): this
	{
		if (this._hasEnded) {
			throw new Error('IfBlock has already ended');
		}
		if (this._hasElse) {
			throw new Error('Else block has already been set');
		}

		this._ifConditions.push({
			condition: createStore<boolean>(true),
			build,
		});

		this._hasElse = true;

		return this;
	}

	endIf(): this
	{
		this._hasEnded = true;
		return this;
	}

	hasEnded(): boolean
	{
		return this._hasEnded;
	}

	setup()
	{
		if (! this.hasEnded()) {
			throw new Error('IfBlock was not ended.');
		}

		super.setup();
		this._ifConditions.forEach((condition, index) => {
			if (! (typeof condition.condition === 'function' && 'subscribe' in condition.condition)) {
				return;
			}
			
			const unsubscribe = condition.condition.subscribe((c) => {

				if (c) {
					if ((this._activeBlockIndex === -1) || (index < this._activeBlockIndex)) {
						super.setup();
						this._activeBlockIndex = index;
					}
				} else {
					if (this._activeBlockIndex === index) {
						let nextActiveIndex = -1;
						for (let i = index; i < this._ifConditions.length; i++) {
							const condition = this._ifConditions[i].condition;
							if (getValue(condition)) {
								nextActiveIndex = i;
								break;
							}
						}
						super.setup();
						this._activeBlockIndex = nextActiveIndex;
					}
				}

				this.attachToDom();
			});
			this.beforeDetachFromDom.subscribe(unsubscribe);
		});
	}

	build(): Array<ComponentItem>
	{
		for (const index of this._ifConditions.keys()) {
			const condition = this._ifConditions[index];
			if (getValue(condition.condition)) {
				this._activeBlockIndex = index;
				const vDom = condition.build();
				return vDom;
			}
		}
		const commentVNode = new Comment(`If placeholder ${(new Date).toUTCString()}`);

		return [commentVNode];
	}
}
