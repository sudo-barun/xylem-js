import IfElseBlock from "./IfElseBlock.js";
import IfElseBuild from "../../types/_internal/IfElseBuild.js";
import map from "../../core/map.js";
import Supplier from "../../types/Supplier.js";

type IfElseBlockItemData = {
	condition: boolean|Supplier<boolean>,
	build: IfElseBuild,
};

export default
class IfElseBlockBuilder
{
	declare _ifConditions: Array<IfElseBlockItemData>;
	declare _hasElse: boolean;

	constructor(condition: Supplier<any>, build: IfElseBuild)
	{
		this._ifConditions = [{
			condition: map<any,boolean>(condition, Boolean),
			build,
		}];
		this._hasElse = false;
	}

	elseIf(condition: Supplier<any>, build: IfElseBuild): this
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

	else(build: IfElseBuild): this
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
