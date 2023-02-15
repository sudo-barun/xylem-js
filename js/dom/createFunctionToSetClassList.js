export function setClass(element, class_, value) {
    if (value) {
        element.classList.add(class_);
    }
    else {
        element.classList.remove(class_);
    }
}
export default function (classFnMap) {
    return function (element) {
        for (const class_ in classFnMap) {
            const fn = classFnMap[class_];
            setClass(element, class_, typeof fn === 'function' ? fn() : fn);
            if ((typeof fn === 'function') && ('subscribe' in fn)) {
                fn.subscribe(function (value) {
                    setClass(element, class_, value);
                });
            }
            // TODO: unsubscribe
        }
    };
}
