import Component from "../Component.js";
export default class ForEachBlockItem extends Component {
    build(attributes) {
        return attributes.build.apply(this, attributes.buildArgs);
    }
}
