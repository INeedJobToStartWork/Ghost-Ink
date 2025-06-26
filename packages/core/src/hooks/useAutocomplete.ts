import type { autocompleteReducer } from "@/reducers";
import { stringStoreSystem } from "@/reducers";

//----------------------
// Types
//----------------------

type TComponent = "inputText";

//----------------------
// CONSTANTS
//----------------------

export const AUTOCOMPLETE_SETTINGS = {
	inputText: {
		storeSystem: stringStoreSystem,
		filter: (input: string) => (suggestion: string) => suggestion.toLowerCase().startsWith(input.toLowerCase()),
		currentSuggestions: []
	}
} as const satisfies Record<TComponent, Parameters<typeof autocompleteReducer>[0]>;
