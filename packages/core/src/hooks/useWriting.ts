import { useReducer } from "react";
import { stringReducer, cursorReducer, CURSOR_ACTIONS_TYPES, STRING_ACTIONS_TYPES } from "@/reducers";
import useEffectInput from "./useEffectInput";

//----------------------
// CONSTANTS
//----------------------

//----------------------
// Types
//----------------------

//----------------------
// Functions
//----------------------

/**
 * Writing Hook for managing text input and cursor position
 *
 * @example
 * ```ts
 * const [[textState, textDispatch], [cursorState, cursorDispatch]] = useWriting();
 * ```
 *
 * @returns a tuple with two items:
 * 1. `[text, textDispatch]` — `stringReducer` the current text and a dispatch function
 * 2. `[cursor, cursorDispatch]` — `cursorReducer` the current cursor position and a dispatch function
 */
export const useWriting = () => {
	const [state, setValueDispatch] = useReducer(stringReducer, "");
	const [stateCursor, setCursorDispatch] = useReducer(cursorReducer, 0);

	useEffectInput({
		MOVE_CURSOR_LEFT: {
			when: (_, key) => key.leftArrow,
			do: () => {
				setCursorDispatch({
					type: CURSOR_ACTIONS_TYPES.MOVE_CURSOR,
					payload: -1,
					max: state.length
				});
			}
		},
		MOVE_CURSOR_RIGHT: {
			when: (_, key) => key.rightArrow,
			do: () => {
				setCursorDispatch({
					type: CURSOR_ACTIONS_TYPES.MOVE_CURSOR,
					payload: 1,
					max: state.length
				});
			}
		},
		DELETE_CHAR_LEFT: {
			when: (_, key) => key.backspace || key.delete,
			do: () => {
				if (stateCursor <= 0) return;
				setValueDispatch({
					type: STRING_ACTIONS_TYPES.REMOVE,
					payload: {
						from: stateCursor - 1,
						value: 1
					}
				});
				setCursorDispatch({
					type: CURSOR_ACTIONS_TYPES.MOVE_CURSOR,
					payload: -1,
					max: state.length
				});
			}
		},
		ADD_CHAR_RIGHT: {
			when: (input, key) => Boolean(input) && !key.ctrl && !key.meta,
			do: input => {
				setValueDispatch({
					type: STRING_ACTIONS_TYPES.ADD,
					payload: {
						value: input,
						from: stateCursor
					}
				});
				setCursorDispatch({
					type: CURSOR_ACTIONS_TYPES.MOVE_CURSOR,
					payload: 1,
					max: state.length + 1
				});
			}
		}
	});

	return [
		[state, setValueDispatch],
		[stateCursor, setCursorDispatch]
	] as [[typeof state, typeof setValueDispatch], [typeof stateCursor, typeof setCursorDispatch]];
};

export default useWriting;
