import ForEachBlock from "./ForEachBlock.js";
export default class ForEachBlockBuilder {
    _array;
    _build;
    constructor(array, build) {
        this._array = array;
        this._build = build;
    }
    endForEach() {
        return new ForEachBlock(this._array, this._build);
    }
}
