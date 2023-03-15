import Component from "../Component.js";
export default class ForEachBlockItem extends Component {
    build(attributes) {
        const build = attributes.build;
        return build(...attributes.buildArgs, this);
    }
}
