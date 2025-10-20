/* eslint-disable complexity */
import { useEffect, useReducer, useState } from "react";
import { selectReducer } from "@/reducers";
import { useEffectInput } from "@/hooks";
import type { useWriting } from "@/hooks";

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

//----------------------
// Functions
//----------------------

/** @dontexport */
type TOptions = {
	/**
	 * The strategies to use for the writing hook
	 */
	//TODO: Possible, if you will change X strategy you will lose the current state at them, prevent from this or add notation.
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
 * @param writingState - The state and dispatch tuple from `useWriting` hook, including text and cursor state.
//  * @returns `selectReducer` A tuple with the current selection state and a dispatch function to update selection.
 * @returns a tuple with two items:
 * 1. `[selection, setSelectDispatch]` — `selectReducer` the current selection state and a dispatch function to update selection.
 * 3. `[settings, setSettings]` — the current settings to set in run time.
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
	const [[state, setStateDispatch], [cursorState, cursorStateDispatch]] = writingState;
	const [lastPosition, setLastPosition] = useState<number | undefined>(cursorState);

	useEffect(() => {
		setSelectDispatch({ type: "SET_MAX", payload: state.length });
	}, [state]);

	useEffectInput({
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
			when: (_, key) => key.delete || key.backspace,
			do: () => {
				setStateDispatch({ type: "REMOVE", payload: { from: selection.from, to: selection.to } });
				setSelectDispatch({ type: "CLEAR_SELECTION" });
			}
		},
		CLEAR_OR_REPLACE_SELECTION: {
			when: () => true,
			do: (_, key) => {
				//TODO: That should be in useEffect but useEffect break somewhere order of generation, for sure it will break something
				if (lastPosition != cursorState) setLastPosition(cursorState);
				if (
					selection.from != 0 &&
					selection.from != undefined &&
					!(key.leftArrow || key.rightArrow || key.upArrow || key.downArrow)
				) {
					// setStateDispatch({ type: "REMOVE", payload: { from: selection.from, to: selection.to } });
					// setStateDispatch({ type: "ADD", payload: { value: input, from: cursorState } });
				}
				setSelectDispatch({ type: "CLEAR_SELECTION" });
			}
		}
	});

	return [
		[selection, setSelectDispatch],
		[settings, setSettings]
	] as [[typeof selection, typeof setSelectDispatch], [typeof settings, typeof setSettings]];
};
