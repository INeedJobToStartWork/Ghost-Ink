/* eslint-disable complexity */
import { useReducer } from "react";
import { selectReducer } from "@/reducers";
import { useInput } from "ink";
import type { useWriting } from "@/hooks";

//----------------------
// Functions
//----------------------

/**
 * Hook to manage text selection state and update selection based on user input.
 * Integrates with text and cursor state from `useWriting` hook.
 *
 * Handles key input for:
 * - Ctrl + A to select all text and move cursor to end.
 * - Shift + Arrow keys to extend selection.
 * - Arrow keys without Shift to clear selection.
 * - Text input replacing current selection.
 *
 * @example
 * ```ts
 * const [selection, selectionDispatch] = useSelect(useWriting());
 * ```
 *
 * @param writingState - The state and dispatch tuple from `useWriting` hook, including text and cursor state.
 * @returns `selectReducer` A tuple with the current selection state and a dispatch function to update selection.
 *
 */
export const useSelect = (writingState: ReturnType<typeof useWriting>) => {
	const [selection, setSelectDispatch] = useReducer(selectReducer, {});
	const [[state, setStateDispatch], [cursorState, cursorStateDispatch]] = writingState;

	useInput((input, key) => {
		//TODO: To Switch
		if (key.ctrl && input === "a") {
			setSelectDispatch({ type: "SELECT_ALL", payload: state.length });
			cursorStateDispatch({ type: "MOVE_TO_END", payload: state.length });
		} else if (key.shift && (key.leftArrow || key.rightArrow)) {
			setSelectDispatch({ type: "EXTEND_SELECTION", payload: { position: cursorState } });
		} else if (key.leftArrow || key.rightArrow || key.downArrow || key.upArrow) {
			setSelectDispatch({ type: "CLEAR_SELECTION" });
		} else if (selection.from != void 0 && selection.to != void 0) {
			setStateDispatch({ type: "REMOVE", payload: { from: selection.from, to: selection.to } });
			setStateDispatch({ type: "ADD", payload: { value: input, from: cursorState } });
			setSelectDispatch({ type: "CLEAR_SELECTION" });
		}
	});

	return [selection, setSelectDispatch] as [typeof selection, typeof setSelectDispatch];
};
