import CommentComponent from "../dom/_internal/CommentComponent.js";
import Component from "../dom/Component.js";
import ElementComponent from "../dom/_internal/ElementComponent.js";
import TextComponent from "../dom/_internal/TextComponent.js";

type ComponentChildren = Array<ElementComponent|TextComponent|CommentComponent|Component>;

export default ComponentChildren;
