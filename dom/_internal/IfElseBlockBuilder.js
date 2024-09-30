import IfElseBlock from "./IfElseBlock.js";
export default class IfElseBlockBuilder {
    constructor(condition, build) {
        this._ifConditions = [{
                condition,
                build,
            }];
        this._hasElse = false;
    }
    elseIf(condition, build) {
        if (this._hasElse) {
            throw new Error('Else block has already been set');
        }
        this._ifConditions.push({
            condition,
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
        return new IfElseBlock({
            itemAttributesArray: this._ifConditions,
        });
    }
}
