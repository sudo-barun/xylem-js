import Comment from "./Comment.js";
import Component from "./Component.js";
import createStore from "../core/createStore.js";
import forEachBlockMutation from "./forEachBlockMutation.js";
export default class ForEachBlock extends Component {
    _array;
    _build;
    _placeholder = null;
    _forItems;
    constructor(array, build) {
        super();
        this._array = array;
        this._build = build;
    }
    _getFallback() {
        const commentVNode = new Comment(`For placeholder ${(new Date).toUTCString()}`);
        this._placeholder = commentVNode;
        return commentVNode;
    }
    build() {
        const array = this._getArray();
        this._forItems = array.map((value, index, array) => {
            let index$;
            if (this._array instanceof Array) {
                index$ = createStore(index);
            }
            else if ('index$Array' in this._array) {
                index$ = this._array.index$Array[index];
            }
            else {
                index$ = createStore(index);
            }
            return this._build.bind(this)(value, index$, array);
        });
        if (array.length === 0) {
            return [this._getFallback()];
        }
        return this._forItems.flat();
    }
    _getArray() {
        return this._array instanceof Array ? this._array : this._array();
    }
    _buildVDomFragmentForNewlyAddedArrayItem(item, index) {
        return this._build(item, this._array.index$Array[index], this._array);
    }
    setup() {
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
                const unsubscribeMutation = this._array.mutate.subscribe(({ action, item, index$ }) => {
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
}
