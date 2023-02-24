import Comment from "../dom/Comment.js";
import Component from "../dom/Component.js";
import Element from "../dom/Element.js";
import Text from "../dom/Text.js";

type ComponentItem = Element|Text|Comment|Component<any>;

export default ComponentItem;
