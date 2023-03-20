import Component from "../Component.js";
import createStore from "../../core/createStore.js";
import ForEachBlockItem from "./ForEachBlockItem.js";
function getArray(array) {
    return array instanceof Array ? array : array._();
}
export default class ForEachBlock extends Component {
    build(attributes) {
        if ('subscribe' in this._attributes.array) {
            const unsubscribe = this._attributes.array.subscribe((array) => {
                super.reload();
            });
            this.beforeDetachFromDom.subscribe(unsubscribe);
            if ('mutate' in this._attributes.array) {
                const unsubscribeMutation = this._attributes.array.mutation.subscribe((arrayMutation) => {
                    const [_, action, ...mutationArgs] = arrayMutation;
                    const handler = action.forEachBlock;
                    if (!('forEachBlock' in action)) {
                        console.error('Array was mutated with action but no handler found for the action.', action);
                        throw new Error('Array was mutated with action but no handler found for the action.');
                    }
                    if (!isHandler(handler)) {
                        throw new Error('Provided handler is invalid.');
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
                index$ = this.bindSupplier(attributes.array.index$Array[index]);
            }
            else {
                index$ = createStore(index);
            }
            return new ForEachBlockItem({
                build: attributes.build,
                buildArgs: [value, index$],
            });
        });
    }
    _buildVDomFragmentForNewlyAddedArrayItem(item, index) {
        return new ForEachBlockItem({
            build: this._attributes.build,
            buildArgs: [
                item,
                this.bindSupplier(this._attributes.array.index$Array[index]),
            ],
        });
    }
    getLength() {
        if (this._attributes.array instanceof Array) {
            return this._attributes.array.length;
        }
        else {
            return this._attributes.array._().length;
        }
    }
}
function isHandler(value) {
    return typeof value === 'function';
}
