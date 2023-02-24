import ComponentItem from "../types/ComponentItem.js";
import IfElseBlock from "./IfElseBlock.js";
import map from "../core/map.js";
import Store from "../types/Store.js";

type IfCondition = {condition: boolean|Store<boolean>, build: () => Array<ComponentItem>};

export default
class IfElseBlockBuilder
{
	_ifConditions: Array<IfCondition> = [];
	_hasElse: boolean = false;

	constructor(condition: Store<any>, build: () => Array<ComponentItem>)
	{
		this._ifConditions.push({
			condition: map<any,boolean>(condition, Boolean),
			build,
		});
	}

	elseIf(condition: Store<any>, build: () => Array<ComponentItem>): this
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

	else(build: () => Array<ComponentItem>): this
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
		return new IfElseBlock(this._ifConditions);
	}
}
