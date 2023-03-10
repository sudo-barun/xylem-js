import Component from "../js/dom/Component.js";
import mountComponent from "../js/dom/mountComponent.js";
import parseHTML from "../js/dom/parseHTML.js";

class ComponentWithUnclosedElement1 extends Component
{
	build()
	{
		return parseHTML([
			'<div>',
			[
				'sample text',
			],
		]);
	}
}

class ComponentWithUnclosedElement2 extends Component
{
	build()
	{
		return parseHTML([
			'<div>',
			[
				'sample text',
				'<br>',
				'sample text',
			],
			'</div>',
		]);
	}
}

try {
	mountComponent(new ComponentWithUnclosedElement1(), document.getElementById('root'));
	console.error('An exception was thrown:\n', ex);
} catch(ex) {
	console.error('An exception was thrown:\n', ex);
}

try {
	mountComponent(new ComponentWithUnclosedElement2(), document.getElementById('root'));
} catch(ex) {
	console.error('An exception was thrown:\n', ex);
}
