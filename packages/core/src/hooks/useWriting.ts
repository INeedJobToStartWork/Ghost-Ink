import { useInput } from "ink";
import { useReducer } from "react";
import { stringReducer, cursorReducer, CURSOR_ACTIONS_TYPES, STRING_ACTIONS_TYPES } from "@/reducers";

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

	useInput((input, key) => {
		// eslint-disable-next-line default-case, @typescript-eslint/switch-exhaustiveness-check
		switch (true) {
			case key.leftArrow: {
				setCursorDispatch({
					type: CURSOR_ACTIONS_TYPES.MOVE_CURSOR,
					payload: -1,
					max: state.length
				});
				break;
			}
			case key.rightArrow: {
				setCursorDispatch({
					type: CURSOR_ACTIONS_TYPES.MOVE_CURSOR,
					payload: 1,
					max: state.length
				});
				break;
			}
			// case key.backspace || key.delete: {
			// 	setValueDispatch({
			// 		type: "REMOVE",
			// 		payload: {
			// 			from: stateCursor - (key.backspace ? 1 : 0),
			// 			value: 1
			// 		}
			// 	});
			// 	if (key.backspace) setCursorDispatch({ type: "MOVE_CURSOR", payload: -1, max: 99 }); //TODO: FIX MAX SHOULDN'T BE REQUIRED
			// 	break;
			// }
			case key.backspace: {
				if (stateCursor > 0) {
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
				break;
			}
			case key.delete: {
				if (stateCursor < state.length) {
					setValueDispatch({
						type: STRING_ACTIONS_TYPES.REMOVE,
						payload: {
							from: stateCursor,
							value: 1
						}
					});
				}
				break;
			}
			case input && !key.ctrl && !key.meta: {
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
				break;
			}
		}
	});

	return [
		[state, setValueDispatch],
		[stateCursor, setCursorDispatch]
	] as [[typeof state, typeof setValueDispatch], [typeof stateCursor, typeof setCursorDispatch]];
};

export default useWriting;
