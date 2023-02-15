export default function setAttribute(element, name, value) {
    if (value === true) {
        element.setAttribute(name, '');
    }
    else if ([undefined, null, false].includes(value)) {
        element.removeAttribute(name);
    }
    else {
        element.setAttribute(name, value);
    }
}
