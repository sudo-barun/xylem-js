import Comment from "./Comment.js";
import Component from "./Component.js";
import getValue from "../utilities/getValue.js";
export default class IfElseBlock extends Component {
    _ifConditions = [];
    _activeBlockIndex = -1;
    constructor(ifConditions = []) {
        super();
        this._ifConditions = ifConditions;
    }
    setup() {
        super.setup();
        this._ifConditions.forEach((condition, index) => {
            if (!(typeof condition.condition === 'function' && 'subscribe' in condition.condition)) {
                return;
            }
            const unsubscribe = condition.condition.subscribe((c) => {
                if (c) {
                    if ((this._activeBlockIndex === -1) || (index < this._activeBlockIndex)) {
                        super.setup();
                        this._activeBlockIndex = index;
                    }
                }
                else {
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
    build() {
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
