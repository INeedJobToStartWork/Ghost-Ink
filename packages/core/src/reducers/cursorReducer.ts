import type { TIsNegative } from "@/types";
import { myError } from "oh-my-error";
import type { IMyError, TMyErrorList } from "oh-my-error";

//----------------------
// Errors
//----------------------

/** @internal @dontexport */
export const MY_ERROR_LIST_CURSOR_REDUCER = {
	NOT_FOUND_ACTION: {
		name: "Not found action",
		code: "NOT_FOUND_ACTION",
		message: { dev: (action: string) => `Action '${action}' do not exist` }
	},
	MISSING_PROPERTY: {
		name: "Missing property",
		code: "MISSING_PROPERTY",
		message: { dev: (property: string) => `Missing '${property}' property.` },
		hint: { dev: (hint: string) => hint }
	}
} as const satisfies TMyErrorList<IMyError>;

//----------------------
// Types
//----------------------

/** @dontexport */
type TMoveCursorAction<T extends number> = (TIsNegative<T> extends true ? Record<never, never> : { max: number }) & {
	/**
	 * Delta value clamped between 0 and `max`.
	 *
	 * @example
	 * ```
	 * setDispatch({type:"MOVE_CURSOR",max:state.length,payload:10}) // Cursor Position + 10
	 * setDispatch({type:"MOVE_CURSOR",payload:-10}) // Cursor Position - 10
	 * ```
	 */
	payload: T;
	type: typeof CURSOR_ACTIONS_TYPES.MOVE_CURSOR;
};

/** @dontexport */
type TCursorReducerAction<T extends number> =
	| TMoveCursorAction<T> //TODO: FIX Loosing generic type - always require `max`
	| {
			/** Value to set */
			payload: number;
			type: typeof CURSOR_ACTIONS_TYPES.MOVE_TO_END;
	  }
	| {
			/** Value to set */
			payload: number;
			type: typeof CURSOR_ACTIONS_TYPES.SET_POSITION;
	  }
	| {
			type: typeof CURSOR_ACTIONS_TYPES.MOVE_TO_START;
	  };

//----------------------
// Reducer Actions
//----------------------

/**
 * Action types for `cursorReducer`:
 * - `MOVE_CURSOR`: Move cursor by a delta (`payload`) clamped between 0 and `max` (if provided).
 * - `MOVE_TO_END`: Jump cursor to the end position (`payload`).
 * - `SET_POSITION`: Set cursor to a specific value.
 * - `MOVE_TO_START`: Reset cursor to 0.
 */
export const CURSOR_ACTIONS_TYPES = {
	/** Move cursor by a delta (`payload`) clamped between 0 and `max` (if provided). */
	MOVE_CURSOR: "MOVE_CURSOR",
	/** Jump cursor to the end position (`payload`). */
	MOVE_TO_END: "MOVE_TO_END",
	/** Set cursor to a specific value. */
	SET_POSITION: "SET_POSITION",
	/** Reset cursor to 0. */
	MOVE_TO_START: "MOVE_TO_START"
} as const;

//----------------------
// Functions
//----------------------

/**
 * Reducer function for managing a numeric cursor position.
 *
 * @example
 * ```
 * const [cursorState,cursorDispatch] = useReducer(cursorReducer,0)
 * ```
 *
 * @param state - Current cursor position
 * @param action -`CURSOR_ACTIONS_TYPES` Action object of type `TCursorAction<T>`
 */
export const cursorReducer = <T extends number>(state: number, action: TCursorReducerAction<T>): number => {
	switch (action.type) {
		case CURSOR_ACTIONS_TYPES.SET_POSITION: {
			return action.payload;
		}
		case CURSOR_ACTIONS_TYPES.MOVE_CURSOR: {
			if (action.payload > 0 && !("max" in action)) {
				throw myError(MY_ERROR_LIST_CURSOR_REDUCER.MISSING_PROPERTY, {
					message: { dev: ["max"] },
					hint: { dev: ["If payload it's > 0 - Define max value"] }
				});
			}
			const finalValue = state + action.payload;
			const clampedValue = "max" in action ? Math.min(finalValue, action.max) : finalValue;
			return Math.max(0, clampedValue);
		}
		case CURSOR_ACTIONS_TYPES.MOVE_TO_START: {
			return 0;
		}
		case CURSOR_ACTIONS_TYPES.MOVE_TO_END: {
			return action.payload;
		}
		default: {
			// @ts-expect-error action.type:never but it still can be anything, string,number etc which case do not exist
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			throw myError(MY_ERROR_LIST_CURSOR_REDUCER.NOT_FOUND_ACTION, { message: { dev: [action.type] } });
		}
	}
};

export default cursorReducer;
