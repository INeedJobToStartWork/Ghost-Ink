import React, { useEffect, useReducer } from "react";
import { textRender } from "@/functions";
import { AUTOCOMPLETE_SETTINGS, useSelect, useWriting } from "@/hooks";
import { TUncontrolledComponent } from "@/types";
import { Box, Text, useInput } from "ink";
import { autocompleteReducer } from "@/reducers";

//----------------------
// Types
//----------------------

type TInputUncontrolledProps = {
	readonly styles?: Parameters<typeof textRender>[0]["styles"];
	// readonly value: string;
	readonly initialValue?: string;
	// eslint-disable-next-line no-unused-vars
	readonly onSubmit?: (...args: any) => any;
} & TUncontrolledComponent<string> & {
		/** Initial autocomplete */
		readonly initAutocomplete: string[];
		/** Callback executed when currentSuggestions.length == 0 */
		// readonly acReducer?: useReducer<autocompleteReducer>;
		// [S, ActionDispatch<A>]
		// readonly acReducer?: [Parameters<typeof autocompleteReducer>[0], React.Dispatch<typeof autocompleteReducer<any,any>>];
		readonly acReducer?: [Parameters<typeof autocompleteReducer>[0], React.Dispatch<{ type: string; payload?: any }>];

		/** Callback executed when currentSuggestions.length == 0 */
		readonly autocompleteCB?: (...anyParameters: any) => string[];
	};

//----------------------
// Functions
//----------------------

/**
 * Text Input
 *
 * @example
 * ```tsx
 * import { useState } from "react"
 * const [state, setState] = useState("");
 *
 * <InputUncontrolled
 *   value={state}
 *   onChange={setState}
 *   onSubmit={(val) => console.log("Submitted:", val)}
 *   styles={[
 *     { start: 0, end: 1, tag: 'Text', props: { color: 'green' } }
 *   ]}
 * />
 * ```
 *
 * Built with:
 * @see {@link useWriting}
 * @see {@link useSelect}
 * @see {@link textRender}
 *
 */
export const InputUncontrolled = (props: TInputUncontrolledProps) => {
	const writingReturn = useWriting();
	const [[state]] = writingReturn;
	useSelect(writingReturn);

	const [acState, acDispatch] = props.acReducer ?? useReducer(autocompleteReducer, AUTOCOMPLETE_SETTINGS.inputText);
	// const [acState, acDispatch] = useReducer(autocompleteReducer, AUTOCOMPLETE_SETTINGS.inputText);
	// const [acState, acDispatch] = useAutocomplete("inputText", { currentSuggestions: props.initAutocomplete ?? [] });
	// const [acState, acDispatch] = useAutocomplete("inputText", {});
	// const [acState, acDispatch] = useAutocomplete("inputText");
	// const [acState, acDispatch] = useReducer(autocompleteReducer, {
	// 	storeSystem: stringStoreSystem,
	// 	filter: (input: string) => (suggestion: string) => suggestion.toLowerCase().startsWith(input.toLowerCase()),
	// 	currentSuggestions: props.initAutocomplete ?? []
	// });

	useEffect(() => {
		props.onChange(props.initialValue);
		acDispatch({ type: "ADD_SUGGESTION", payload: ["apple", "ananas", "anaconda"] });
	}, []);

	useEffect(() => {
		props.onChange(state);
		acDispatch({ type: "GET_SUGGESTIONS", payload: state });
	}, [state]);

	useEffect(() => {
		if (acState.currentSuggestions.length == 0 && props.autocompleteCB != void 0) {
			acDispatch({ type: "ADD_SUGGESTION", payload: props.autocompleteCB(acState.currentInput) });
		}
	}, [acState.currentSuggestions]);

	//----------------------
	// Inputs
	//----------------------

	useInput(input => {
		// eslint-disable-next-line default-case, @EslintSonar/no-small-switch
		switch (true) {
			case input == "enter" && "onSubmit" in props && props.onSubmit != void 0: {
				props.onSubmit();
				break;
			}
		}
	});

	const renderedValue = textRender({
		text: state,
		styles: props.styles ?? []
	});

	return (
		<Box>
			<Text>{renderedValue}</Text>
			<Text color={"gray"}>{(acState.currentSuggestions[0] ?? "").slice(state.length)}</Text>
		</Box>
	);
};

export default InputUncontrolled;
