import { useReducer, useState } from "react";
import { stringReducer, cursorReducer, CURSOR_ACTIONS_TYPES, STRING_ACTIONS_TYPES } from "@/reducers";
import useEffectInput from "./useEffectInput";
import type { UseReducerReturn } from "@/types";
import { inputMapHandler } from "@/utils";

//----------------------
// CONSTANTS
//----------------------

/**
 * Default Settings for the Writing Hook
 *
 * @readonly
 * @see {@link useWriting}
 * @see {@link TOptions}
 */
export const SETTINGS_DEFAULT_USEWRITING: TOptions = {
	strategies: {
		cursorReducer: cursorReducer,
		stringReducer: stringReducer
	}
} as const;

/**
 * Input Listeners for the {@link useEffectInput} used by {@link useWriting}
 *
 * Handles Input For:
 * 1. `MOVE_CURSOR` - Move cursor left or right
 * 2. `DELETE_CHAR_LEFT` - Delete character left of cursor (For Backspace)
 * 3. `ADD_CHAR_RIGHT` - Add character right of cursor (For typing)
 *
 * @example
 * ```ts
 * const [state, setValueDispatch] = useReducer(stringReducer, "");
 * const [stateCursor, setCursorDispatch] = useReducer(cursorReducer, 0);
 * useEffectInput(INPUT_LISTENERS_USEWRITING([state, setValueDispatch], [stateCursor, setCursorDispatch]));
 * ```
 *
 * @param stringReducer - Return of `useReducer(stringReducer, ...)`
 * @param cursorReducer - Return of `useReducer(cursorReducer, ...)`
 *
 *
 * @returns The input listeners object
 *
 * @see {@link useWriting}
 * @see {@link useEffectInput}
 * @see {@link stringReducer}
 * @see {@link cursorReducer}
 */
export const INPUT_LISTENERS_USEWRITING = (
	[state, setValueDispatch]: UseReducerReturn<typeof SETTINGS_DEFAULT_USEWRITING.strategies.stringReducer>,
	[stateCursor, setCursorDispatch]: UseReducerReturn<typeof SETTINGS_DEFAULT_USEWRITING.strategies.cursorReducer>
) =>
	({
		MOVE_CURSOR: {
			when: (_, key) => key.leftArrow || key.rightArrow,
			do: (_, key) => {
				setCursorDispatch({
					type: CURSOR_ACTIONS_TYPES.MOVE_CURSOR,
					payload: key.leftArrow ? -1 : 1,
					max: state.length
				});
			}
		},
		/** Delete character left of cursor (For Backspace)*/
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
		/** Add character right of cursor (For typing) */
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
	}) as const satisfies Parameters<typeof useEffectInput>[0];

//----------------------
// Types
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
	inputMap?: Parameters<typeof inputMapHandler<ReturnType<typeof INPUT_LISTENERS_USEWRITING>>>[1];
	/**
	 * The strategies to use for the writing hook
	 */
	//TODO: Possible, if you will change X strategy you will lose the current state at them, prevent from this or add notation and warn user.
	//TODO: Write strategies type cuz probly this will be bad
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
 * @returns a tuple with items:
 * 1. `[text, textDispatch]` — `stringReducer` the current text and a dispatch function
 * 2. `[cursor, cursorDispatch]` — `cursorReducer` the current cursor position and a dispatch function
 * 3. `[settings, setSettings]` — the current settings to set in run time.
 */
export const useWriting = (
	/**
	 * @default SETTINGS_DEFAULT_USEWRITING
	 * @see {@link SETTINGS_DEFAULT_USEWRITING}
	 */
	options?: Partial<TOptions>
) => {
	const [settings, setSettings] = useState<TOptions>({ ...SETTINGS_DEFAULT_USEWRITING, ...options });
	const [state, setValueDispatch] = useReducer(settings.strategies.stringReducer, "");
	const [stateCursor, setCursorDispatch] = useReducer(settings.strategies.cursorReducer, 0);

	//----
	// INPUT MAP HANDLER
	//----

	useEffectInput(
		inputMapHandler(
			INPUT_LISTENERS_USEWRITING([state, setValueDispatch], [stateCursor, setCursorDispatch]),
			settings.inputMap
		)
	);

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
