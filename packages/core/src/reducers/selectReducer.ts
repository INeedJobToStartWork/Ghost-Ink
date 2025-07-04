import { myError } from "oh-my-error";
import type { IMyError, TMyErrorList } from "oh-my-error";

//----------------------
// Errors
//----------------------

/** @internal @dontexport */
export const MY_ERROR_LIST = {
	NOT_FOUND_ACTION: {
		name: "Not found action",
		code: "NOT_FOUND_ACTION",
		message: { dev: (action: string) => `Action '${action}' does not exist` }
	}
} as const satisfies TMyErrorList<IMyError>;

//----------------------
// Actions Types
//----------------------

/**
 * Action types for {@link selectedReducer}:
 * - `START_SELECTION`: Start a new selection from a given position and direction
 * - `EXTEND_SELECTION`: Extend the current selection to a new position, optionally changing direction
 * - `SELECT_ALL`: Select all from position 0 to given end
 * - `CLEAR_SELECTION`: Clear the current selection
 *
 * @see {@link selectedReducer}
 */
export const SELECT_ACTIONS_TYPES = {
	/** Start a new selection from a given position and direction */
	START_SELECTION: "START_SELECTION",
	/** Extend the current selection to a new position, optionally changing direction */
	EXTEND_SELECTION: "EXTEND_SELECTION",
	/** Select all from position 0 to given end */
	SELECT_ALL: "SELECT_ALL",
	/** Clear the current selection */
	CLEAR_SELECTION: "CLEAR_SELECTION"
} as const;

//----------------------
// Types
//----------------------

/** Direction of text selection @dontexport */
export type TSelectionDirection = "left" | "right";

/** State shape for text selection @dontexport */
export interface ISelectionState {
	/** The fixed anchor point where the selection started */
	anchor?: number;
	/** Direction of selection relative to anchor */
	direction?: TSelectionDirection;
	/** Selection start position (inclusive) */
	from?: number;
	/** Selection end position (exclusive) */
	to?: number;
}

/** @dontexport */
export type TSelectionReducerAction =
	| {
			/** Position marking the end of selection (typically length of text) */
			payload: number;
			type: typeof SELECT_ACTIONS_TYPES.SELECT_ALL;
	  }
	| {
			payload: {
				/** Direction of the selection ("left" or "right") */
				direction: TSelectionDirection;
				/** Position where selection starts */
				position: number;
			};
			type: typeof SELECT_ACTIONS_TYPES.START_SELECTION;
	  }
	| {
			payload: {
				/** Optional direction to extend selection; defaults to current or "right" */
				direction?: TSelectionDirection;
				/** New position to extend selection to */
				position: number;
			};
			type: typeof SELECT_ACTIONS_TYPES.EXTEND_SELECTION;
	  }
	| {
			type: typeof SELECT_ACTIONS_TYPES.CLEAR_SELECTION;
	  };

//----------------------
// Functions
//----------------------

/**
 * Reducer function to handle text selection state.
 *
 * @description Tracks the anchor point (where selection started) and the active end point (where selection currently extends to).
 *
 * @param state - Current selection state
 * @param action - {@link SELECT_ACTIONS_TYPES} Action to update selection
 */
export const selectReducer = (state: ISelectionState, action: TSelectionReducerAction): ISelectionState => {
	switch (action.type) {
		case SELECT_ACTIONS_TYPES.START_SELECTION: {
			const { position, direction } = action.payload;
			return {
				from: position,
				to: position,
				anchor: position,
				direction
			};
		}
		case SELECT_ACTIONS_TYPES.EXTEND_SELECTION: {
			const { position, direction = state.direction || "right" } = action.payload;

			if (state.from === void 0 || state.to === void 0) {
				return {
					from: position,
					to: position,
					anchor: position,
					direction
				};
			}

			if (state.anchor !== void 0) {
				if (position >= state.anchor) {
					return {
						from: state.anchor,
						to: position,
						anchor: state.anchor,
						direction: "right"
					};
				}
				return {
					from: position,
					to: state.anchor,
					anchor: state.anchor,
					direction: "left"
				};
			}

			// Legacy behavior without anchor point
			if (position < state.from) {
				return {
					from: position,
					to: state.to,
					direction: "left"
				};
			}

			return {
				from: state.from,
				to: position,
				direction: "right"
			};
		}
		case SELECT_ACTIONS_TYPES.CLEAR_SELECTION: {
			return {
				from: void 0,
				to: void 0,
				anchor: void 0,
				direction: state.direction
			};
		}
		case SELECT_ACTIONS_TYPES.SELECT_ALL: {
			return {
				from: 0,
				to: action.payload,
				anchor: 0,
				direction: "right"
			};
		}
		default: {
			// @ts-expect-error exhaustive check - action.type: never but can be anything else
			throw myError(MY_ERROR_LIST.NOT_FOUND_ACTION, { message: { dev: [action.type] } });
		}
	}
};

export default selectReducer;
