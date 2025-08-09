import type CommentComponent from "../dom/_internal/CommentComponent.js";
import type Component from "../dom/Component.js";
import type ElementComponent from "../dom/_internal/ElementComponent.js";
import type TextComponent from "../dom/_internal/TextComponent.js";

type ComponentChildren = Array<ElementComponent|TextComponent|CommentComponent|Component>;

export { type ComponentChildren as default };
