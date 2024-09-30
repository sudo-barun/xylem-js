import IfElseBlock from "./IfElseBlock.js";
import IfElseBuild from "../../types/_internal/IfElseBuild.js";
import Supplier from "../../types/Supplier.js";

type IfElseBlockItemData = {
	condition: unknown|Supplier<unknown>,
	build: IfElseBuild,
};

export default
class IfElseBlockBuilder
{
	declare _ifConditions: Array<IfElseBlockItemData>;
	declare _hasElse: boolean;

	constructor(condition: unknown|Supplier<unknown>, build: IfElseBuild)
	{
		this._ifConditions = [{
			condition,
			build,
		}];
		this._hasElse = false;
	}

	elseIf(condition: unknown|Supplier<unknown>, build: IfElseBuild): this
	{
		if (this._hasElse) {
			throw new Error('Else block has already been set');
		}

		this._ifConditions.push({
			condition,
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
