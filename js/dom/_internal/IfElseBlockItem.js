import Component from "../Component.js";
export default class IfElseBlockItem extends Component {
    build(attributes) {
        const isActive$ = this.bindSupplier(attributes.isActive$);
        isActive$.subscribe(() => {
            this.reload();
        });
        if (isActive$._()) {
            const build = attributes.build;
            if (typeof build === 'function') {
                return build(this);
            }
            else {
                return build._(this);
            }
        }
        return [];
    }
}
