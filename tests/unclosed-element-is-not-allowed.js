import arrayToVirtualDom from "../js/dom/arrayToVirtualDom.js";
import Component from "../js/dom/Component.js";
import mount from "../js/dom/mount.js";

class ComponentWithUnclosedElement1 extends Component
{
	build()
	{
		return arrayToVirtualDom([
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
		return arrayToVirtualDom([
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
	mount(new ComponentWithUnclosedElement1(), document.getElementById('root'));
	console.error('An exception was thrown:\n', ex);
} catch(ex) {
	console.error('An exception was thrown:\n', ex);
}

try {
	mount(new ComponentWithUnclosedElement2(), document.getElementById('root'));
} catch(ex) {
	console.error('An exception was thrown:\n', ex);
}
