import ForEachBlock from "./ForEachBlock.js";
export default class ForEachBlockBuilder {
    constructor(array, build) {
        this._array = array;
        this._build = build;
    }
    endForEach() {
        return new ForEachBlock({
            array: this._array,
            build: this._build
        });
    }
}
