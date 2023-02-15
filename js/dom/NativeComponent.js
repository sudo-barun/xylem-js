export default class NativeComponent {
    getDomNode() {
        if (this._domNode === undefined) {
            throw new Error('DOM Node not available. setupDom() may not have been called.');
        }
        return this._domNode;
    }
}
export const ComponentWithSingleTextContentMixin = {
    afterAttachToDom() {
        if (typeof this._textContent === 'function') {
            const textContentFn = this._textContent;
            if ('subscribe' in textContentFn && 'unsubscribe') {
                const unsubscribe = textContentFn.subscribe((emittedValue) => {
                    (this._domNode).textContent = emittedValue;
                });
                this._cleanup = () => {
                    unsubscribe();
                };
            }
        }
    },
    beforeDetachFromDom() {
        if (this._cleanup !== undefined) {
            this._cleanup();
        }
    },
};
