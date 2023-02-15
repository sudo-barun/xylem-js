import Store from "./Store";

type ProxyStore<T> = (
	Store<T>
	&
	{ unsubscribeFromSource: () => void }
)

export default ProxyStore;
