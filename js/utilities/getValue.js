export default function getValue(value) {
    if (value instanceof Function) {
        return value();
    }
    return value;
}
