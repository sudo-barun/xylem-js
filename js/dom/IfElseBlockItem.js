import Component from "./Component.js";
export default class IfElseBlockItem extends Component {
    setup() {
        super.setup();
        const unsubscribe = this._attributes.isActive$.subscribe(() => {
            super.setup();
            this.notifyAfterAttachToDom();
        });
        this.beforeDetachFromDom.subscribe(unsubscribe);
    }
    build(attributes) {
        if (attributes.isActive$()) {
            return attributes.build.apply(this);
        }
        return [];
    }
}
