import type HasLifecycle from "../types/HasLifecycle.js";

export
const none: HasLifecycle = {
	beforeDetach: {
		subscribe: () => ({ _(){} }),
	},
};
