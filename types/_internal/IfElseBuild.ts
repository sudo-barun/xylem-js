import ComponentChildren from "../ComponentChildren";
import FunctionOrCallableObject from "../FunctionOrCallableObject";
import IfElseBlockItem from "../../dom/_internal/IfElseBlockItem";

type IfElseBuild = FunctionOrCallableObject<[IfElseBlockItem], ComponentChildren>;

export default IfElseBuild;
