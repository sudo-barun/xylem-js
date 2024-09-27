import Component from "../Component.js";
import createStore from "../../core/createStore.js";
import getValue from "../../utilities/getValue.js";
import IfElseBlockItem from "./IfElseBlockItem.js";
import isSupplier from "../../utilities/isSupplier.js";
function getActiveBlockIndex(conditions) {
    for (let i = 0; i < conditions.length; i++) {
        if (getValue(conditions[i])) {
            return i;
        }
    }
    return -1;
}
export default class IfElseBlock extends Component {
    constructor(attributes) {
        super(attributes);
        this._activeBlockIndex = -1;
        this._conditionStores = attributes.itemAttributesArray.map(() => createStore(false));
        this._isActiveStores = attributes.itemAttributesArray.map(() => createStore(false));
    }
    setActive(index) {
        this._activeBlockIndex = index;
        for (let index = 0; index < this._isActiveStores.length; index++) {
            const isActive$ = this._isActiveStores[index];
            isActive$._(index === this._activeBlockIndex);
        }
    }
    build(attributes) {
        this.setActive(getActiveBlockIndex(attributes.itemAttributesArray.map((itemAttributes) => itemAttributes.condition)));
        for (let index = 0; index < attributes.itemAttributesArray.length; index++) {
            const itemAttributes = attributes.itemAttributesArray[index];
            if (!(isSupplier(itemAttributes.condition))) {
                continue;
            }
            const unsubscribe = itemAttributes.condition.subscribe((c) => {
                if (c) {
                    if ((this._activeBlockIndex === -1) || (index < this._activeBlockIndex)) {
                        this.setActive(index);
                    }
                }
                else {
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
