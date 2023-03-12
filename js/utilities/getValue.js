import isDataNode from "./isDataNode.js";
export default function getValue(value) {
    if (isDataNode(value)) {
        return value._();
    }
    return value;
}
