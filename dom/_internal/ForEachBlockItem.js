import Component from "../Component.js";
export default class ForEachBlockItem extends Component {
    build(attributes) {
        const build = attributes.build;
        if (typeof build === 'function') {
            return build(...attributes.buildArgs, this);
        }
        else {
            return build._(...attributes.buildArgs, this);
        }
    }
}
