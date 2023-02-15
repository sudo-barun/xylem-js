import Component from "./dom/Component.js";
class Sample extends Component {
    static injects = [];
    buildWithAttributes(attributes) {
    }
}
class ComponentFactory {
    componentConstructor;
    attributes;
    constructor(componentConstructor, attributes) {
        this.componentConstructor = componentConstructor;
        this.attributes = attributes;
    }
    create(injects) {
        return new this.componentConstructor({ ...injects, ...this.attributes });
    }
}
class SampleFactory extends ComponentFactory {
    create(injects) {
        return new Sample();
    }
}
