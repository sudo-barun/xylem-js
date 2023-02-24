import Comment from "./Comment.js";
import Component from "./Component.js";
export default class IfElseBlockItem extends Component {
    setup() {
        const attributes = this._attributes;
        super.setup();
        const unsubscribe = attributes.isActive$.subscribe(() => {
            super.setup();
            this.attachToDom();
        });
        this.beforeDetachFromDom.subscribe(unsubscribe);
    }
    build(attributes) {
        if (attributes.isActive$()) {
            return attributes.build.apply(this);
        }
        const commentVNode = new Comment(`If placeholder ${(new Date).toUTCString()}`);
        return [commentVNode];
    }
}
