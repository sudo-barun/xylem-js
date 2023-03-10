import Component from "../js/dom/Component.js";
import mountComponent from "../js/dom/mountComponent.js";
import parseHTML from "../js/dom/parseHTML.js";

class EscapedContent extends Component
{
	build()
	{
		return parseHTML([
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

mountComponent(new EscapedContent(), document.getElementById('root'));
