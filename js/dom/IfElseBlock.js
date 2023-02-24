import Component from "./Component.js";
import createStore from "../core/createStore.js";
import getValue from "../utilities/getValue.js";
import IfElseBlockItem from "./IfElseBlockItem.js";
function getActiveBlockIndex(conditions) {
    for (let i = 0; i < conditions.length; i++) {
        if (getValue(conditions[i])) {
            return i;
        }
    }
    return -1;
}
export default class IfElseBlock extends Component {
    _activeBlockIndex = -1;
    _conditionStores;
    _isActiveStores;
    constructor(attributes) {
        super(attributes);
        this._conditionStores = attributes.itemAttributesArray.map(() => createStore(false));
        this._isActiveStores = attributes.itemAttributesArray.map(() => createStore(false));
    }
    setActive(index) {
        this._activeBlockIndex = index;
        this._isActiveStores.forEach((isActive$, index) => isActive$(index === this._activeBlockIndex));
    }
    setup() {
        const attributes = this._attributes;
        this.setActive(getActiveBlockIndex(attributes.itemAttributesArray.map((itemAttributes) => itemAttributes.condition)));
        super.setup();
        attributes.itemAttributesArray.forEach((itemAttributes, index) => {
            if (!(typeof itemAttributes.condition === 'function' && 'subscribe' in itemAttributes.condition)) {
                return;
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
        });
    }
    build(attributes) {
        return attributes.itemAttributesArray.map((itemAttributes, index) => {
            return new IfElseBlockItem({
                build: itemAttributes.build,
                isActive$: this._isActiveStores[index],
            });
        });
    }
}
