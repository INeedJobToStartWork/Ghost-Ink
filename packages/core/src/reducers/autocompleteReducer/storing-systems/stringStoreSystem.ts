import type { TAlphabet } from "@/types";

// eslint-disable-next-line @EslintUnusedImports/no-unused-imports, @typescript-eslint/no-unused-vars
import type { TStoreSystem } from "../storeSystem";
import { storeSystemCreator } from "../storeSystem";

//----------------------
// Types
//----------------------

/** @internal @dontexport */
type TStringStoreSystem = Partial<Record<TAlphabet | "other", Set<TStringSuggestion>>>;
/** @internal @dontexport */
type TStringSuggestion = string;

//----------------------
// Functions
//----------------------

/**
 * Store System for string-based elements.
 * @see {@link TStoreSystem}
 */
export const stringStoreSystem = storeSystemCreator<TStringStoreSystem, TStringSuggestion>({
	add(suggestionsState, suggestions) {
		let result = suggestionsState;
		for (const suggestion of suggestions) {
			const key = getKeyFromValue(suggestion, v => v);
			if (!result[key]) result[key] = new Set();
			result[key].add(suggestion);
		}
		return result;
	},

	loader(suggestions, inputValue: string) {
		// eslint-disable-next-line @EslintPrefArrayFunc/prefer-array-from
		if (inputValue) return [...(suggestions[getKeyFromValue(inputValue, v => v)] ?? [])];
		const result: TStringSuggestion[] = [];
		for (const key of Object.keys(suggestions)) {
			result.push(...(suggestions[key as keyof typeof suggestions] ?? []));
		}
		return result;
	},

	remove(suggestionsState, suggestions) {
		let result = suggestionsState;
		for (const suggestion of suggestions) {
			result[getKeyFromValue(suggestion, (v: string) => v)]?.delete(suggestion);
		}
		return result;
	}
});

export default stringStoreSystem;

//----------------------
// Helpers
//----------------------

/** @internal @dontexport */
function getKeyFromValue<T>(value: T, mapper: (v: T) => string): keyof TStringStoreSystem {
	const str = mapper(value).toLowerCase();
	const firstChar = str.charAt(0);
	if (firstChar >= "a" && firstChar <= "z") return firstChar as TAlphabet;
	return "other";
}
