import IfElseBlock from "./IfElseBlock.js";
import map from "../core/map.js";
export default class IfElseBlockBuilder {
    _ifConditions = [];
    _hasElse = false;
    constructor(condition, build) {
        this._ifConditions.push({
            condition: map(condition, Boolean),
            build,
        });
    }
    elseIf(condition, build) {
        if (this._hasElse) {
            throw new Error('Else block has already been set');
        }
        this._ifConditions.push({
            condition: map(condition, Boolean),
            build,
        });
        return this;
    }
    else(build) {
        if (this._hasElse) {
            throw new Error('Else block has already been set');
        }
        this._ifConditions.push({
            condition: true,
            build,
        });
        this._hasElse = true;
        return this;
    }
    endIf() {
        return new IfElseBlock(this._ifConditions);
    }
}
