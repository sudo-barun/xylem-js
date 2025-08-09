import type ComponentChildren from "../ComponentChildren";
import type FunctionOrCallableObject from "../FunctionOrCallableObject";
import type IfElseBlockItem from "../../dom/_internal/IfElseBlockItem";

type IfElseBuild = FunctionOrCallableObject<[IfElseBlockItem], ComponentChildren>;

export { type IfElseBuild as default };
