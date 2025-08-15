import Component from './Component.js';
export default class RawHTML extends Component {
    setupDom() {
        super.setupDom();
        const doc = new DOMParser().parseFromString(this._attributes.children, 'text/html');
        this._childNodes = Array.from(doc.body.childNodes);
    }
    build() {
        return [];
    }
    setChildNodes(childNodes) {
        this._childNodes = childNodes;
    }
    domNodes() {
        const nodes = this._childNodes.slice();
        nodes.unshift(this._firstNode);
        nodes.push(this._lastNode);
        return nodes;
    }
    getContent() {
        return this._attributes.children;
    }
}
