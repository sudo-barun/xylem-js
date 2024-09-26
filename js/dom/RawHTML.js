import Component from './Component.js';
export default class RawHTML extends Component {
    constructor(content) {
        super();
        this._content = content;
    }
    setupDom() {
        super.setupDom();
        const doc = new DOMParser().parseFromString(this._content, 'text/html');
        this._childNodes = Array.from(doc.body.childNodes);
    }
    build() {
        return [];
    }
    setChildNodes(childNodes) {
        this._childNodes = childNodes;
    }
    domNodes() {
        return this._childNodes;
    }
    getContent() {
        return this._content;
    }
}
