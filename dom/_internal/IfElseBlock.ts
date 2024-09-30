import Component from "../Component.js";
import ComponentChildren from "../../types/ComponentChildren.js";
import createStore from "../../core/createStore.js";
import getValue from "../../utilities/getValue.js";
import IfElseBlockItem from "./IfElseBlockItem.js";
import IfElseBuild from "../../types/_internal/IfElseBuild.js";
import isSupplier from "../../utilities/isSupplier.js";
import Store from "../../types/Store.js";
import Supplier from "../../types/Supplier.js";

type IfElseBlockItemData = {
	condition: unknown|Supplier<unknown>,
	build: IfElseBuild,
};

type Attributes = {
	itemAttributesArray: IfElseBlockItemData[],
};

function getActiveBlockIndex(conditions: Array<unknown|Supplier<unknown>>): number
{
	for (let i = 0; i < conditions.length; i++) {
		if (getValue(conditions[i])) {
			return i;
		}
	}
	return -1;
}

export default
class IfElseBlock extends Component<Attributes>
{
	declare _activeBlockIndex: number;
	declare _conditionStores: Supplier<boolean>[];
	declare _isActiveStores: Store<boolean>[];

	constructor(attributes: Attributes)
	{
		super(attributes);

		this._activeBlockIndex = -1;
		this._conditionStores = attributes.itemAttributesArray.map(() => createStore(false));
		this._isActiveStores = attributes.itemAttributesArray.map(() => createStore(false));
	}

	setActive(index: number)
	{
		this._activeBlockIndex = index;
		for (let index = 0; index < this._isActiveStores.length; index++) {
			const isActive$ = this._isActiveStores[index];
			isActive$._(index === this._activeBlockIndex);
		}
	}

	build(attributes: Attributes): ComponentChildren
	{
		this.setActive(getActiveBlockIndex(
			attributes.itemAttributesArray.map((itemAttributes) => itemAttributes.condition)
		));

		for (let index = 0; index < attributes.itemAttributesArray.length; index++) {
			const itemAttributes = attributes.itemAttributesArray[index];
			if (! (isSupplier(itemAttributes.condition))) {
				continue;
			}

			const unsubscribe = itemAttributes.condition.subscribe((c) => {

				if (c) {
					if ((this._activeBlockIndex === -1) || (index < this._activeBlockIndex)) {
						this.setActive(index);
					}
				} else {
					if (this._activeBlockIndex === index) {
						let nextActiveIndex = -1;
						for (let i = index; i < attributes.itemAttributesArray.length; i++) {
							const condition = attributes.itemAttributesArray[i].condition;
							if (getValue(condition)) {
								nextActiveIndex = i;
								break;
							}
						}
						this.setActive(nextActiveIndex);
					}
				}
			});
			this.beforeDetachFromDom.subscribe(unsubscribe);
		}

		return attributes.itemAttributesArray.map((itemAttributes, index) => {
			return new IfElseBlockItem({
				build: itemAttributes.build,
				isActive$: this._isActiveStores[index],
			});
		});
	}
}
