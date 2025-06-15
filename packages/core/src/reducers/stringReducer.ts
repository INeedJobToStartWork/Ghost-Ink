import { myError } from "oh-my-error";
import type { IMyError, TMyErrorList } from "oh-my-error";

//----------------------
// Errors
//----------------------

/** @internal @dontexport */
export const STRING_ERROR_LIST = {
	NOT_FOUND_ACTION: {
		name: "Not found action",
		code: "NOT_FOUND_ACTION",
		message: { dev: (action: string) => `Action '${action}' does not exist.` }
	},
	MISSING_PROPERTY: {
		name: "Missing property",
		code: "MISSING_PROPERTY",
		message: { dev: (prop: string) => `Missing required property: '${prop}'` },
		hint: { dev: (hint: string) => hint }
	}
} as const satisfies TMyErrorList<IMyError>;

//----------------------
// Actions Types
//----------------------

/**
 * Action types for {@link stringReducer}:
 * - `ADD`: Add characters to string
 * - `REMOVE`: Remove characters from string
 *
 * @see {@link stringReducer}
 */
export const STRING_ACTIONS_TYPES = {
	/** Add characters to string */
	ADD: "ADD",
	/** Remove characters from string */
	REMOVE: "REMOVE"
} as const;

//----------------------
// Types
//----------------------

/** @dontexport */
export type TStringReducerAction =
	| {
			/**
			 * - `true` - Remove all characters
			 * - `{to:number} - Remove all characters to `to` index
			 * - `{from:number,value?:number}` - Remove all characters from `from` to `from` + `value` or state.length
			 * - `{from:number,to:number}` - Remove characters from `from` to `to` index
			 */
			payload:
				| true
				| (
						| {
								from: number;
								to: number;
						  }
						| { from: number; value?: number }
						| { to: number }
				  );
			type: typeof STRING_ACTIONS_TYPES.REMOVE;
	  }
	| {
			payload: {
				/** Index of adding value @default state.length */
				from?: number;
				/** Value to ad */
				value: string;
			};
			type: typeof STRING_ACTIONS_TYPES.ADD;
	  };

//----------------------
// Reducer
//----------------------

/**
 * Reducer function for managing string content.
 *
 * @example
 * ```ts
 * const [text, dispatch] = useReducer(stringReducer, "");
 * dispatch({ type: "ADD", payload: { from: 0, value: "Hello" } });
 * dispatch({ type: "REMOVE", payload: { from: 2, to: 4 } });
 * ```
 *
 * @param state - Current string value
 * @param action - {@link STRING_ACTIONS_TYPES} Action object of type {@link TStringReducerAction}
 */
export const stringReducer = (state: string, action: TStringReducerAction): string => {
	switch (action.type) {
		case STRING_ACTIONS_TYPES.ADD: {
			const { from = state.length, value } = action.payload;
			return state.slice(0, from) + value + state.slice(from);
		}

		case STRING_ACTIONS_TYPES.REMOVE: {
			if (action.payload === true) return "";

			if ("from" in action.payload && "to" in action.payload) {
				const { from, to } = action.payload;
				return state.slice(0, from) + state.slice(to);
			}

			if ("from" in action.payload) {
				const { from, value } = action.payload;

				if (value === void 0) return state.slice(from, state.length);

				const start = value < 0 ? from + value : from;
				const end = value < 0 ? from : from + value;
				return state.slice(0, start) + state.slice(end);
			}

			if ("to" in action.payload) return state.slice(action.payload.to);

			throw myError(STRING_ERROR_LIST.MISSING_PROPERTY, {
				message: { dev: ["'from' or 'to'"] },
				hint: { dev: ["REMOVE action must contain at least 'from' or 'to'."] }
			});
		}

		default: {
			throw myError(STRING_ERROR_LIST.NOT_FOUND_ACTION, {
				// @ts-expect-error to catch unexpected string actions
				message: { dev: [action.type] }
			});
		}
	}
};

export default stringReducer;
