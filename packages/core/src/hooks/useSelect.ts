/* eslint-disable complexity */
import { useEffect, useReducer, useState } from "react";
import { selectReducer } from "@/reducers";
import { INPUT_LISTENERS_USEWRITING, useEffectInput } from "@/hooks";
import type { useWriting } from "@/hooks";
import type { UseReducerReturn } from "@/types";
import { inputMapHandler } from "@/utils";

//----------------------
// CONSTANTS
//----------------------

/**
 * Default Settings for the Select Hook
 * @see {@link useSelect}
 * @see {@link TOptions}
 */
export const SETTINGS_DEFAULT_USESELECT: TOptions = {
	strategies: {
		selectReducer: selectReducer
	}
} as const;

/**
 * Input Listeners for the {@link useEffectInput} used by {@link useSelect}
 *
 * Handles Input For:
 * 1. `SELECTING_ALL` - Select all text
 * 2. `EXTENDING_SELECTION` - Extend Text (depends on cursor position)
 * 3. `REMOVING_SELECTED_TEXT` - Remove Selected Text
 * 5. `CLEAR_OR_REPLACE_SELECTION` - Clear or replace selected text
 *
 * @example
 * ```ts
 * useEffectInput(SETTINGS_DEFAULT_USESELECT([selection, setSelectDispatch], [lastPosition, setLastPosition], writingState));
 * ```
 *
 * @param stringReducer - Return of `useReducer(stringReducer, ...)`
 * @param cursorReducer - Return of `useReducer(cursorReducer, ...)`
 *
 *
 * @returns The input listeners object
 *
 * @see {@link useSelect}
 * @see {@link useEffectInput}
 * @see {@link stringReducer}
 * @see {@link cursorReducer}
 */
export const INPUT_LISTENERS_USESELECT = (
	// [state, setValueDispatch]: UseReducerReturn<typeof SETTINGS_DEFAULT_USEWRITING.strategies.stringReducer>,
	// [stateCursor, setCursorDispatch]: UseReducerReturn<typeof SETTINGS_DEFAULT_USEWRITING.strategies.cursorReducer>
	[selection, setSelectDispatch]: UseReducerReturn<typeof selectReducer>,
	[lastPosition, setLastPosition]: ReturnType<typeof useState<number | undefined>>,
	[[state, setStateDispatch], [cursorState, cursorStateDispatch]]: ReturnType<typeof useWriting>
) =>
	({
		SELECTING_ALL: {
			when: (input, key) => key.ctrl && input === "a",
			do: () => {
				setSelectDispatch({ type: "SELECT_ALL", payload: state.length });
				cursorStateDispatch({ type: "MOVE_TO_END", payload: state.length });
			}
		},
		EXTENDING_SELECTION: {
			when: (_, key) => key.shift && (key.leftArrow || key.rightArrow),
			do: (_, key) => {
				setSelectDispatch({
					type: "EXTEND_SELECTION",
					payload: {
						position: cursorState,
						lastPosition: lastPosition,
						max: state.length,
						direction: key.leftArrow ? "left" : "right"
					}
				});
			}
		},

		REMOVING_SELECTED_TEXT: {
			when: INPUT_LISTENERS_USEWRITING([state, setStateDispatch], [cursorState, cursorStateDispatch]).DELETE_CHAR_LEFT
				.when,
			do: () => {
				if (selection.from == selection.to) {
					INPUT_LISTENERS_USEWRITING(
						[state, setStateDispatch],
						[cursorState, cursorStateDispatch]
					).DELETE_CHAR_LEFT.do();
				} else {
					setStateDispatch({ type: "REMOVE", payload: { from: selection.from ?? 0, to: selection.to } });
					setSelectDispatch({ type: "CLEAR_SELECTION" });
				}
			}
		},
		CLEAR_OR_REPLACE_SELECTION: {
			when: () => true,
			do: (input, key) => {
				//TODO: That should be in useEffect but useEffect break somewhere order of generation, for sure it will break something
				if (lastPosition != cursorState) setLastPosition(cursorState);
				if (
					selection.from != 0 &&
					selection.from != undefined &&
					!(key.leftArrow || key.rightArrow || key.upArrow || key.downArrow)
				) {
					setStateDispatch({ type: "REMOVE", payload: { from: selection.from, to: selection.to } });
					setStateDispatch({ type: "ADD", payload: { value: input, from: cursorState } });
				}
				setSelectDispatch({ type: "CLEAR_SELECTION" });
			}
		}
	}) as const satisfies Parameters<typeof useEffectInput>[0];

//----------------------
// Functions
//----------------------

/** @dontexport */
type TOptions = {
	//TODO: Better Description and explain how to use that with example for `inputMap`
	/**
	 * The input map settings used by {@link useEffectInput}
	 *
	 * @default INPUT_LISTENERS_USEWRITING
	 * @see {@link INPUT_LISTENERS_USEWRITING}
	 */
	inputMap?: Parameters<typeof inputMapHandler<ReturnType<typeof INPUT_LISTENERS_USESELECT>>>[1];
	/**
	 * The strategies to use for the select hook
	 */
	//TODO: Possible, if you will change X strategy you will lose the current state at them, prevent from this or add notation and warn user.
	//TODO: Write strategies type cuz probly this will be bad
	strategies: {
		/**
		 * The reducer function to use for the selection state
		 */
		selectReducer: typeof selectReducer;
	};
};

/**
 * Hook to manage text selection state and update selection based on user input.
 * Integrates with text and cursor state from {@link useWriting} hook.
 *
 * Handles key input for:
 * - `Ctrl + A` to select all text and move cursor to end.
 * - `Shift + Arrow keys` to extend selection.
 * - `Arrow keys without Shift` to clear selection.
 * - Text input replacing current selection.
 *
 * @example
 * ```ts
 * const [[selection, selectionDispatch]] = useSelect(useWriting());
 * const [[selection, selectionDispatch], [settings, setSettings]] = useSelect(useWriting());
 * ```
 *
 * @param writingState - The state and dispatch tuple from {@link useWriting} hook, including text and cursor state.
 * @returns a tuple with two items:
 * 1. `[selection, setSelectDispatch]` — {@link selectReducer} the current selection state and a dispatch function to update selection.
 * 2. `[settings, setSettings]` — the current settings to set in run time.
 * @default SETTINGS_DEFAULT_USESELECT
 * @see {@link SETTINGS_DEFAULT_USESELECT}
 */
export const useSelect = (writingState: ReturnType<typeof useWriting>, options?: Partial<TOptions>) => {
	//TODO: Make it in one State to optimize i guess
	const [settings, setSettings] = useState<TOptions>({ ...SETTINGS_DEFAULT_USESELECT, ...options });
	const [selection, setSelectDispatch] = useReducer(settings.strategies.selectReducer, {
		from: 0,
		to: 0,
		anchor: 0,
		max: 0,
		direction: "right"
	});
	const [[state], [cursorState], [, setWritingSettings]] = writingState;
	const [lastPosition, setLastPosition] = useState<number | undefined>(cursorState);

	useEffect(() => {
		setWritingSettings(prev => ({
			...prev,
			inputMap: {
				...prev.inputMap,
				DELETE_CHAR_LEFT: void 0
			}
		}));
	}, []);

	useEffect(() => {
		setSelectDispatch({ type: "SET_MAX", payload: state.length });
	}, [state]);

	//----
	// INPUT MAP HANDLER
	//----

	useEffectInput(
		inputMapHandler(
			INPUT_LISTENERS_USESELECT([selection, setSelectDispatch], [lastPosition, setLastPosition], writingState),
			settings.inputMap
		)
	);

	return [
		[selection, setSelectDispatch],
		[settings, setSettings]
	] as [[typeof selection, typeof setSelectDispatch], [typeof settings, typeof setSettings]];
};
