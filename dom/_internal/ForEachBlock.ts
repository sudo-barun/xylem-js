import ArrayMutation from "../../types/ArrayMutation.js";
import ArraySupplier from "../../types/ArraySupplier.js";
import Component from "../Component.js";
import ComponentChildren from "../../types/ComponentChildren.js";
import createStore from "../../core/createStore.js";
import ForEachBlockItem from "./ForEachBlockItem.js";
import Supplier from "../../types/Supplier.js";
import ForEachBuild from "../../types/_internal/ForEachBuild.js";

type Attributes<T> = {
	array: T[]|Supplier<T[]>|ArraySupplier<T>;
	build: ForEachBuild<T>;
};

function getArray<T>(array: T[]|Supplier<T[]>|ArraySupplier<T>): T[]
{
	return array instanceof Array ? array : array._();
}

export default
class ForEachBlock<T> extends Component<Attributes<T>>
{

	build(attributes: Attributes<T>): ComponentChildren
	{
		if ('subscribe' in this._attributes.array) {
			const unsubscribe = this._attributes.array.subscribe((array) => {
				super.reload();
			});
			this.beforeDetachFromDom.subscribe(unsubscribe);

			if ('mutate' in this._attributes.array) {
				const unsubscribeMutation = this._attributes.array.mutation.subscribe(
					(arrayMutation: ArrayMutation<T>) => {
						const [_, action, ...mutationArgs] = arrayMutation;
						const handler = action.forEachBlock;
						if (! ('forEachBlock' in action)) {
							console.error('Array was mutated with action but no handler found for the action.', action);
							throw new Error('Array was mutated with action but no handler found for the action.');
						}
						if (! isHandler(handler)) {
							throw new Error('Provided handler is invalid.');
						}
						handler.apply(this, mutationArgs);
					}
				);
				this.beforeDetachFromDom.subscribe(unsubscribeMutation);
			}
		}

		const array = getArray(attributes.array);

		return array.map((value, index, array) => {
			let index$;
			if (attributes.array instanceof Array) {
				index$ = createStore(index);
			} else if ('index$Array' in attributes.array) {
				index$ = this.bindSupplier(attributes.array.index$Array[index]);
			} else {
				index$ = createStore(index);
			}
			return new ForEachBlockItem<T>({
				build: attributes.build,
				buildArgs: [value, index$],
			});
		});
	}

	_buildVDomFragmentForNewlyAddedArrayItem(item: T, index: number): ForEachBlockItem<T>
	{
		return new ForEachBlockItem<T>({
			build: this._attributes.build,
			buildArgs: [
				item,
				this.bindSupplier((this._attributes.array as ArraySupplier<T>).index$Array[index]),
			],
		});
	}

	getLength(): number
	{
		if (this._attributes.array instanceof Array) {
			return this._attributes.array.length;
		} else {
			return this._attributes.array._().length;
		}
	}
}

function isHandler(value: unknown): value is Handler
{
	return typeof value === 'function';
}

type Handler = <T>(...args: unknown[]) => void;
