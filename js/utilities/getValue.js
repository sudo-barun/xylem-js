import isSupplier from "./isSupplier.js";
export default function getValue(value) {
    if (isSupplier(value)) {
        return value._();
    }
    return value;
}
