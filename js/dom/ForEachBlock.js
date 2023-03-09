import Component from "./Component.js";
import createStore from "../core/createStore.js";
import ForEachBlockItem from "./ForEachBlockItem.js";
import forEachBlockMutation from "./forEachBlockMutation.js";
function getArray(array) {
    return array instanceof Array ? array : array();
}
export default class ForEachBlock extends Component {
    build(attributes) {
        if ('subscribe' in this._attributes.array) {
            const unsubscribe = this._attributes.array.subscribe((array) => {
                super.reload();
            });
            this.beforeDetachFromDom.subscribe(unsubscribe);
            if ('mutate' in this._attributes.array) {
                const unsubscribeMutation = this._attributes.array.mutate.subscribe((arrayMutation) => {
                    const [_, action, ...mutationArgs] = arrayMutation;
                    const handler = forEachBlockMutation.getHandler(action);
                    if (handler === null) {
                        console.error('Array was mutated with action but no handler found for the action.', action);
                        throw new Error('Array was mutated with action but no handler found for the action.');
                    }
                    handler.apply(this, mutationArgs);
                });
                this.beforeDetachFromDom.subscribe(unsubscribeMutation);
            }
        }
        const array = getArray(attributes.array);
        return array.map((value, index, array) => {
            let index$;
            if (attributes.array instanceof Array) {
                index$ = createStore(index);
            }
            else if ('index$Array' in attributes.array) {
                index$ = attributes.array.index$Array[index];
            }
            else {
                index$ = createStore(index);
            }
            return new ForEachBlockItem({
                build: attributes.build,
                buildArgs: [value, index$, array],
            });
        });
    }
    _buildVDomFragmentForNewlyAddedArrayItem(item, index) {
        return new ForEachBlockItem({
            build: this._attributes.build,
            buildArgs: [
                item,
                this._attributes.array.index$Array[index],
                this._attributes.array,
            ],
        });
    }
    getLength() {
        if (this._attributes.array instanceof Array) {
            return this._attributes.array.length;
        }
        else {
            return this._attributes.array().length;
        }
    }
}
