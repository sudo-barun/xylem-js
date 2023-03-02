import Comment from "./Comment.js";
import Component from "./Component.js";
import createStore from "../core/createStore.js";
import ForEachBlockItem from "./ForEachBlockItem.js";
import forEachBlockMutation from "./forEachBlockMutation.js";
function getArray(attributes) {
    return attributes.array instanceof Array ? attributes.array : attributes.array();
}
export default class ForEachBlock extends Component {
    _placeholder = null;
    _getFallback() {
        const commentVNode = new Comment(`For placeholder ${(new Date).toUTCString()}`);
        this._placeholder = commentVNode;
        return commentVNode;
    }
    build(attributes) {
        const array = getArray(attributes);
        const _forItems = array.map((value, index, array) => {
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
        if (array.length === 0) {
            return [this._getFallback()];
        }
        return _forItems;
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
    setup() {
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
                const unsubscribeMutation = this._attributes.array.mutate.subscribe(({ action, item, index$ }) => {
                    const handler = forEachBlockMutation.getHandler(action);
                    if (handler === null) {
                        console.error('Array was mutated with action but no handler found for the action.', action);
                        throw new Error('Array was mutated with action but no handler found for the action.');
                    }
                    handler.call(this, {
                        item,
                        index$,
                    });
                });
                this.beforeDetachFromDom.subscribe(() => unsubscribeMutation());
            }
        }
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
