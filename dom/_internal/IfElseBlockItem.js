import Component from "../Component.js";
export default class IfElseBlockItem extends Component {
    build(attributes) {
        const isActive$ = attributes.isActive$;
        this.beforeDetach.subscribe(isActive$.subscribe(() => {
            this.reload();
        }));
        if (isActive$._()) {
            const build = attributes.build;
            if (typeof build === 'function') {
                return build.call(this, this);
            }
            else {
                return build._(this);
            }
        }
        return [];
    }
}
