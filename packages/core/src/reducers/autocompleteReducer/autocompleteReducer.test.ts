/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { describe, it, expect } from "vitest";
import { autocompleteReducer, AUTOCOMPLETE_ACTIONS_TYPES } from "./autocompleteReducer";
import { stringStoreSystem } from "./storing-systems";

describe("[MODULE] autocompleteReducer", () => {
	// const filterFn = (input: string) => (suggestion: string) => suggestion.toLowerCase().startsWith(input.toLowerCase());
	const filterFn = (input: string) => (suggestion: string) => suggestion.toLowerCase().startsWith(input.toLowerCase());

	const baseState = {
		currentInput: "",
		currentSuggestions: [],
		suggestions: {},
		storeSystem: stringStoreSystem,
		filter: filterFn
	};

	//-------------------------
	// [PASS]
	//-------------------------
	describe("[PASS]", () => {
		it("Should add suggestions via ADD_SUGGESTION", () => {
			const state = { ...baseState };
			const action = {
				type: AUTOCOMPLETE_ACTIONS_TYPES.ADD_SUGGESTION,
				payload: ["apple", "banana"]
			} as const;

			const result = autocompleteReducer(state, action);

			expect(result.suggestions).toEqual({
				a: new Set(["apple"]),
				b: new Set(["banana"])
			});
			expect(result.currentSuggestions).toEqual([]);
		});

		it("Should remove suggestions via REMOVE_SUGGESTION", () => {
			const state = {
				...baseState,
				suggestions: {
					a: new Set(["apple", "avocado"]),
					b: new Set(["banana"])
				}
			};

			const action = {
				type: AUTOCOMPLETE_ACTIONS_TYPES.REMOVE_SUGGESTION,
				payload: ["banana", "avocado"]
			} as const;

			const result = autocompleteReducer(state, action);

			expect(result.suggestions).toEqual({
				a: new Set(["apple"]),
				b: new Set()
			});
		});

		it("Should get ALL suggestions via GET_SUGGESTIONS", () => {
			const result = autocompleteReducer(
				{
					...baseState,
					suggestions: {
						a: new Set(["apple", "avocado"]),
						b: new Set(["banana"])
					}
				},
				{
					type: AUTOCOMPLETE_ACTIONS_TYPES.GET_SUGGESTIONS,
					payload: ""
				}
			);

			expect(result.currentSuggestions).toEqual(["apple", "avocado", "banana"]);
			expect(result.currentInput).toEqual("");
		});

		it("Should use sorter if provided", () => {
			const action = {
				type: AUTOCOMPLETE_ACTIONS_TYPES.GET_SUGGESTIONS,
				payload: "a"
			} as const;

			const result = autocompleteReducer(
				{
					...baseState,
					suggestions: {
						a: new Set(["apple", "avocado", "apricot"])
					},
					sort: (a: string, b: string) => a.length - b.length
				},
				action
			);

			expect(result.currentSuggestions).toEqual(["apple", "avocado", "apricot"]);
		});
	});
});
