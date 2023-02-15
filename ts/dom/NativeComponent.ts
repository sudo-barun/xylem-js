import Getter from "../types/Getter.js";
import SubscribableGetter from "../types/SubscribableGetter.js";

export default
abstract class NativeComponent
{
	abstract _domNode: ChildNode;
	
	abstract _cleanup?: () => void;
	
	abstract setupDom(): void;
	
	getDomNode(): ChildNode
	{
		if (this._domNode === undefined) {
			throw new Error('DOM Node not available. setupDom() may not have been called.');
		}
		return this._domNode;
	}
	
	afterAttachToDom?(): void
}

export
const ComponentWithSingleTextContentMixin: {
	_textContent?: string|Getter<string>|SubscribableGetter<string>,
	_domNode?: Node,
	_cleanup?: () => void,
	afterAttachToDom(): void;
	beforeDetachFromDom(): void;
} = {
	afterAttachToDom(): void {
		if (typeof this._textContent === 'function') {
			const textContentFn = this._textContent;
			if ('subscribe' in textContentFn && 'unsubscribe') {
				const unsubscribe = textContentFn.subscribe((emittedValue) => {
					(this._domNode!).textContent = emittedValue;
				});
				this._cleanup = () => {
					unsubscribe();
				};
			}
		}
	},

	beforeDetachFromDom(): void {
		if (this._cleanup !== undefined) {
			this._cleanup();
		}
	},
}
