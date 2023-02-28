import arrayToVirtualDom from "../js/dom/arrayToVirtualDom.js";
import Component from "../js/dom/Component.js";
import mount from "../js/dom/mount.js";

class EscapedContent extends Component
{
	build()
	{
		return arrayToVirtualDom([
			'<div>',
			[
				'This is a text without any special character.',
				'<br/>',
				'<b>This is a bold text text.</b>',
				'<br/>',
				'<!--This is a comment-->.',
			],
			'</div>',
		]);
	}
}

mount(new EscapedContent(), document.getElementById('root'));