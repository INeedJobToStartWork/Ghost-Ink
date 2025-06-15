// eslint-disable-next-line @EslintUnusedImports/no-unused-imports, @typescript-eslint/no-unused-vars
import { autocompleteReducer } from "@/reducers";

//----------------------
// Types
//----------------------

/**
 * @internal @dontexport
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type TStoreSystemLoader<GSuggestionsStoreType, GSuggestionType, GInputValue = any> = (
	suggestions: GSuggestionsStoreType,
	inputValue: GInputValue
) => GSuggestionType[];

/**
 * Store System Type used at {@link autocompleteReducer}
 *
 * @typeParam `GSuggestionsStoreType` - The type representing the store's state.
 * @typeParam `GSuggestionType` - The type of a single suggestion element.
 * @typeParam `GFunctionsSystem` - The type that defines functions responsible to add/remove/load elements from `GSuggestionsStoreType`.
 *
 * @see {@link autocompleteReducer}
 * @see {@link storeSystemCreator} - Type-safe creator.
 */
export type TStoreSystem<
	GSuggestionsStoreType,
	GSuggestionType,
	GFunctionsSystem extends (
		suggestionsState: GSuggestionsStoreType,
		suggestions: GSuggestionType[]
	) => GSuggestionsStoreType = (
		suggestionsState: GSuggestionsStoreType,
		suggestions: GSuggestionType[]
	) => GSuggestionsStoreType,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	GInputValue = any
> = (GSuggestionsStoreType extends GSuggestionType[]
	? { loader?: TStoreSystemLoader<GSuggestionsStoreType, GSuggestionType, GInputValue> }
	: { loader: TStoreSystemLoader<GSuggestionsStoreType, GSuggestionType, GInputValue> }) & {
	add: GFunctionsSystem;
	/** Function executed at {@link autocompleteReducer} to remove elements from {@link GSuggestionsStoreType} */
	remove: GFunctionsSystem;
};

//----------------------
// Types (Utils)
//----------------------
//TODO: maybe change all Generics "T" on more schemantic like `GStoreSystem`
/**
 * Infer SuggestionType from {@link TStoreSystem} type.
 * @see {@link TStoreSystem}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SuggestionTypeFromStoreSystem<T> = T extends TStoreSystem<any, infer U> ? U : never;

/**
 * Infer SuggestionStoreType from {@link TStoreSystem} type.
 * @see {@link TStoreSystem}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SuggestionStoreTypeFromStoreSystem<T> = T extends TStoreSystem<infer U, any> ? U : never;

//----------------------
// Functions
//----------------------

/**
 * Type-safe creator for {@link TStoreSystem} configurations.
 *
 * @description This helper function allows for better type inference when defining
 * strongly-typed store system instances.
 * It does not perform any runtime checks.
 *
 * @example
 * ```ts
 *
 * type TStringStoreSystem = TStringSuggestion[];
 * type TStringSuggestion = string;
 *
 * export const stringStoreSystem = storeSystemCreator<TStringStoreSystem, TStringSuggestion>({...})
 * ```
 *
 * @see {@link TStoreSystem}
 */
export const storeSystemCreator = <GSuggestionsStoreType, GSuggestionType>(
	props: TStoreSystem<GSuggestionsStoreType, GSuggestionType>
): TStoreSystem<GSuggestionsStoreType, GSuggestionType> => props;

export default storeSystemCreator;
