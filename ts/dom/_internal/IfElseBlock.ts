import Component from "../Component.js";
import ComponentChildren from "../../types/ComponentChildren.js";
import createStore from "../../core/createStore.js";
import getValue from "../../utilities/getValue.js";
import IfElseBlockItem from "./IfElseBlockItem.js";
import IfElseBuild from "../../types/_internal/IfElseBuild.js";
import isDataNode from "../../utilities/isDataNode.js";
import Store from "../../types/Store.js";
import DataNode from "../../types/DataNode.js";

type IfElseBlockItemData = {
	condition: boolean|DataNode<boolean>,
	build: IfElseBuild,
};

type Attributes = {
	itemAttributesArray: IfElseBlockItemData[],
};

function getActiveBlockIndex(conditions: Array<boolean|DataNode<boolean>>): number
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
	declare _conditionStores: DataNode<boolean>[];
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
		this._isActiveStores.forEach((isActive$, index) => isActive$._(index === this._activeBlockIndex));
	}

	build(attributes: Attributes): ComponentChildren
	{
		this.setActive(getActiveBlockIndex(
			attributes.itemAttributesArray.map((itemAttributes) => itemAttributes.condition)
		));

		attributes.itemAttributesArray.forEach((itemAttributes, index) => {
			if (! (isDataNode(itemAttributes.condition))) {
				return;
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
		});

		return attributes.itemAttributesArray.map((itemAttributes, index) => {
			return new IfElseBlockItem({
				build: itemAttributes.build,
				isActive$: this._isActiveStores[index],
			});
		});
	}
}
