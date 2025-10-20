import { useReducer, useState } from "react";
import { stringReducer, cursorReducer, CURSOR_ACTIONS_TYPES, STRING_ACTIONS_TYPES } from "@/reducers";
import useEffectInput from "./useEffectInput";

//----------------------
// CONSTANTS
//----------------------

/**
 * Default Settings for the Writing Hook
 * @see {@link useWriting}
 * @see {@link TOptions}
 */
export const SETTINGS_DEFAULT_USEWRITING: TOptions = {
	strategies: {
		cursorReducer: cursorReducer,
		stringReducer: stringReducer
	}
} as const;

//----------------------
// Types
//----------------------
/** @dontexport */
type TOptions = {
	/**
	 * The strategies to use for the writing hook
	 */
	//TODO: Possible, if you will change X strategy you will lose the current state at them, prevent from this or add notation.
	strategies: {
		/**
		 * The reducer function to use for the cursor position
		 */
		cursorReducer: typeof cursorReducer;
		/**
		 * The reducer function to use for the text input
		 */
		stringReducer: typeof stringReducer;
	};
};

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
 * ```ts
 * const [[textState, textDispatch], [cursorState, cursorDispatch], [settings, setSettings]] = useWriting();
 * ```
 *
 * @returns a tuple with two items:
 * 1. `[text, textDispatch]` — `stringReducer` the current text and a dispatch function
 * 2. `[cursor, cursorDispatch]` — `cursorReducer` the current cursor position and a dispatch function
 * 3. `[settings, setSettings]` — the current settings to set in run time.
 */
export const useWriting = (
	/**
	 * @default {@link SETTINGS_DEFAULT_USEWRITING}
	 */
	options?: Partial<TOptions>
) => {
	const [settings, setSettings] = useState<TOptions>({ ...SETTINGS_DEFAULT_USEWRITING, ...options });
	const [state, setValueDispatch] = useReducer(settings.strategies.stringReducer, "");
	const [stateCursor, setCursorDispatch] = useReducer(settings.strategies.cursorReducer, 0);

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
		[stateCursor, setCursorDispatch],
		[settings, setSettings]
	] as [
		[typeof state, typeof setValueDispatch],
		[typeof stateCursor, typeof setCursorDispatch],
		[typeof settings, typeof setSettings]
	];
};

export default useWriting;
