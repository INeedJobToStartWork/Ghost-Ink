/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @EslintUnicorn/no-array-callback-reference */
import { myError } from "oh-my-error";
import type { IMyError, TMyErrorList } from "oh-my-error";
import type { SuggestionStoreTypeFromStoreSystem, SuggestionTypeFromStoreSystem, TStoreSystem } from "./storeSystem";

//----------------------
// Errors
//----------------------
// TODO: DRY, not only there
/** @internal @dontexport */
export const MY_ERROR_LIST_AUTOCOMPLETE_REDUCER = {
	NOT_FOUND_ACTION: {
		name: "Not found action",
		code: "NOT_FOUND_ACTION",
		message: { dev: (action: string) => `Action '${action}' do not exist` }
	}
} as const satisfies TMyErrorList<IMyError>;

//----------------------
// Types
//----------------------

/** @dontexport */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HasLoader<T> = T extends { loader: (...args: any) => any } ? true : false;

/**
 * Action types for {@link autocompleteReducer}:
 * - `ADD_SUGGESTION`: Add suggestions
 * - `REMOVE_SUGGESTION`: Remove suggestions
 * - `GET_SUGGESTIONS`: Get suggestions
 *
 * @see {@link autocompleteReducer}
 */
export const AUTOCOMPLETE_ACTIONS_TYPES = {
	/** Add suggestions */
	ADD_SUGGESTION: "ADD_SUGGESTION",
	/** Remove suggestions */
	REMOVE_SUGGESTION: "REMOVE_SUGGESTION",
	/** Get suggestions */
	GET_SUGGESTIONS: "GET_SUGGESTIONS"
} as const;

/**
 * Action object dispatched to `autocompleteReducer`
 *
 * @template T Suggestion and input value type
 */
export type TAutocompleteReducerAction<
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends TStoreSystem<any, any>,
	GFilter extends (
		inputValue: SuggestionTypeFromStoreSystem<T>[number]
	) => Parameters<Array<SuggestionTypeFromStoreSystem<T>>["filter"]>[0]
> =
	| {
			/** Add a suggestion under a key derived from current value */
			payload: Parameters<T["add"]>[1];
			type: typeof AUTOCOMPLETE_ACTIONS_TYPES.ADD_SUGGESTION;
	  }
	| {
			/** Input for suggestions*/
			payload: Parameters<GFilter>[0];
			type: typeof AUTOCOMPLETE_ACTIONS_TYPES.GET_SUGGESTIONS;
	  }
	| {
			/** Remove suggestion from the current key group */
			payload: Parameters<T["remove"]>[1];
			type: typeof AUTOCOMPLETE_ACTIONS_TYPES.REMOVE_SUGGESTION;
	  };

//----------------------
// Reducer
//----------------------

/**
 * Reducer function for autocomplete
 *
 * Handles state changes related to suggestions and input value.
 *
 * @example
 * ```ts
 * const [state, dispatch] = useReducer(autocompleteReducer, initialState);
 * dispatch({ type: AUTOCOMPLETE_ACTIONS_TYPES.ADD_SUGGESTION, payload: ["apple"]);
 * ```
 * @template T Type of suggestion and input value (default: string)
 * @param state Current state of autocomplete
 * @param action Action describing state change
 * @returns New state after applying the action
 *
 * @throws Throws error if action type is not recognized
 *
 */
export const autocompleteReducer = <
	GFilter extends (
		inputValue: SuggestionTypeFromStoreSystem<GStoreType>[number]
	) => Parameters<Array<SuggestionTypeFromStoreSystem<GStoreType>>["filter"]>[0],
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	GStoreType extends TStoreSystem<any, any>
>(
	state: {
		/**
		 * Current suggestions
		 */
		currentInput?: Parameters<GFilter>[0];

		/**
		 * Current suggestions
		 */
		currentSuggestions: Array<SuggestionTypeFromStoreSystem<GStoreType>>;

		/**
		 * Function to filter current suggestions.
		 */
		filter: GFilter;

		/**
		 * Function to sort suggestions according to priority.
		 */
		sort?: Parameters<Array<SuggestionTypeFromStoreSystem<GStoreType>>["sort"]>[0];

		/**
		 * Function to determine way of storing suggestions
		 */
		storeSystem: GStoreType;

		/**
		 * Available suggestions stored by keys (e.g. alphabets)
		 * Each key contains a list of suggestions that start with that letter
		 */
		suggestions?: HasLoader<GStoreType> extends true
			? SuggestionStoreTypeFromStoreSystem<GStoreType>
			: Array<SuggestionTypeFromStoreSystem<GStoreType>>;
	},
	action: TAutocompleteReducerAction<GStoreType, GFilter>
) => {
	const loader = (
		input: typeof state.currentInput = state.currentInput
	): Array<SuggestionTypeFromStoreSystem<GStoreType>> =>
		state.storeSystem.loader
			? (state.storeSystem.loader(state.suggestions, input) as Array<SuggestionTypeFromStoreSystem<GStoreType>>)
			: (state.suggestions as Array<SuggestionTypeFromStoreSystem<GStoreType>>);

	const currentSuggestionsFunction = (
		input: typeof state.currentInput = state.currentInput
	): Array<SuggestionTypeFromStoreSystem<GStoreType>> => {
		let result = loader(input).filter(state.filter(input));
		return typeof state.sort === "function" ? result.sort(state.sort) : result;
	};

	switch (action.type) {
		case AUTOCOMPLETE_ACTIONS_TYPES.ADD_SUGGESTION: {
			return {
				...state,
				currentSuggestions: currentSuggestionsFunction(),
				suggestions: state.storeSystem.add(state.suggestions, action.payload)
			};
		}

		case AUTOCOMPLETE_ACTIONS_TYPES.REMOVE_SUGGESTION: {
			return {
				...state,
				currentSuggestions: currentSuggestionsFunction(),
				suggestions: state.storeSystem.remove(state.suggestions, action.payload)
			};
		}

		case AUTOCOMPLETE_ACTIONS_TYPES.GET_SUGGESTIONS: {
			const nextInput = action.payload;
			return {
				...state,
				currentInput: nextInput,
				currentSuggestions: currentSuggestionsFunction(nextInput)
			};
		}

		default: {
			throw myError(MY_ERROR_LIST_AUTOCOMPLETE_REDUCER.NOT_FOUND_ACTION, {
				// @ts-expect-error action.type:never but it still can be anything, string,number etc which case do not exist
				message: { dev: [action.type] }
			});
		}
	}
};

export default autocompleteReducer;
