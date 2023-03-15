import Component from "../Component.js";
export default class IfElseBlockItem extends Component {
    build(attributes) {
        const isActive$ = this.bindDataNode(attributes.isActive$);
        isActive$.subscribe(() => {
            this.reload();
        });
        if (isActive$._()) {
            const build = attributes.build;
            return build(this);
        }
        return [];
    }
}
