import ComponentChildren from "../../types/ComponentChildren.js";
import IfElseBlock from "./IfElseBlock.js";
import map from "../../core/map.js";
import DataNode from "../../types/DataNode.js";

type IfElseBlockItemData = {
	condition: boolean|DataNode<boolean>,
	build: () => ComponentChildren,
};

export default
class IfElseBlockBuilder
{
	declare _ifConditions: Array<IfElseBlockItemData>;
	declare _hasElse: boolean;

	constructor(condition: DataNode<any>, build: () => ComponentChildren)
	{
		this._ifConditions = [{
			condition: map<any,boolean>(condition, Boolean),
			build,
		}];
		this._hasElse = false;
	}

	elseIf(condition: DataNode<any>, build: () => ComponentChildren): this
	{
		if (this._hasElse) {
			throw new Error('Else block has already been set');
		}

		this._ifConditions.push({
			condition: map<any,boolean>(condition, Boolean),
			build,
		});

		return this;
	}

	else(build: () => ComponentChildren): this
	{
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

	endIf(): IfElseBlock
	{
		return new IfElseBlock({
			itemAttributesArray: this._ifConditions,
		});
	}
}
