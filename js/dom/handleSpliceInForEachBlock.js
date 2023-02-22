import Component from "./Component.js";
export default function handleSpliceInForEachBlock({ index$ }) {
    if (this._forItems.length === 1) {
        const fallback = this._getFallback();
        fallback.setupDom();
        this._placeholder = fallback;
        this.getFirstNode()?.before(fallback.getDomNode());
        this._virtualDom.push(fallback);
    }
    const removedFragment = this._forItems.splice(index$(), 1);
    removedFragment[0].forEach((componentItem) => {
        const index = this._virtualDom.indexOf(componentItem);
        this._virtualDom.splice(index, 1);
    });
    removedFragment[0].forEach((componentItem) => {
        if (componentItem instanceof Component) {
            componentItem.getDomNodes().forEach((node) => node.remove());
        }
        else {
            componentItem.getDomNode().remove();
        }
    });
}
