/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
import { describe, expect, test } from "vitest";
import { stringReducer, STRING_ACTIONS_TYPES, STRING_ERROR_LIST } from "./stringReducer";
import { myError } from "oh-my-error";

describe("[FUNCTION] stringReducer", () => {
	describe("[PASS]", () => {
		test("ADD inserts value at specific index", () => {
			const result = stringReducer("Hello", {
				type: STRING_ACTIONS_TYPES.ADD,
				payload: {
					from: 2,
					value: "XX"
				}
			});
			expect(result).toBe("HeXXllo");
		});

		test("ADD appends value at the end when 'from' is undefined", () => {
			const result = stringReducer("Test", {
				type: STRING_ACTIONS_TYPES.ADD,
				payload: {
					value: "ing"
				}
			});
			expect(result).toBe("Testing");
		});

		test("REMOVE with payload true clears the string", () => {
			const result = stringReducer("ResetMe", {
				type: STRING_ACTIONS_TYPES.REMOVE,
				payload: true
			});
			expect(result).toBe("");
		});

		test("REMOVE from:to removes a range", () => {
			const result = stringReducer("abcdef", {
				type: STRING_ACTIONS_TYPES.REMOVE,
				payload: {
					from: 2,
					to: 4
				}
			});
			expect(result).toBe("abef");
		});

		test("REMOVE from with positive value removes forward range", () => {
			const result = stringReducer("abcdef", {
				type: STRING_ACTIONS_TYPES.REMOVE,
				payload: {
					from: 1,
					value: 3
				}
			});
			expect(result).toBe("aef");
		});

		test("REMOVE from with negative value removes backward range", () => {
			const result = stringReducer("abcdef", {
				type: STRING_ACTIONS_TYPES.REMOVE,
				payload: {
					from: 4,
					value: -2
				}
			});
			expect(result).toBe("abef");
		});

		test("REMOVE to cuts off from start to index", () => {
			const result = stringReducer("abcdef", {
				type: STRING_ACTIONS_TYPES.REMOVE,
				payload: {
					to: 3
				}
			});
			expect(result).toBe("def");
		});

		test("REMOVE from without value keeps slice from that index", () => {
			const result = stringReducer("abcdef", {
				type: STRING_ACTIONS_TYPES.REMOVE,
				payload: {
					from: 2
				}
			});
			expect(result).toBe("cdef");
		});
	});

	describe("[ERROR]", () => {
		test("REMOVE without from or to throws MISSING_PROPERTY", () => {
			try {
				stringReducer("abcdef", {
					type: STRING_ACTIONS_TYPES.REMOVE,
					// @ts-expect-error missing required fields
					payload: {}
				});
			} catch (error) {
				expect(error).toEqual(
					myError(STRING_ERROR_LIST.MISSING_PROPERTY, {
						message: { dev: ["'from' or 'to'"] },
						hint: { dev: ["REMOVE action must contain at least 'from' or 'to'."] }
					})
				);
			}
		});

		test("Unknown action type throws NOT_FOUND_ACTION", () => {
			try {
				stringReducer("test", {
					// @ts-expect-error: invalid action
					type: "UNKNOWN",
					// @ts-expect-error: invalid payload
					payload: "???"
				});
			} catch (error) {
				expect(error).toEqual(
					myError(STRING_ERROR_LIST.NOT_FOUND_ACTION, {
						message: { dev: ["UNKNOWN"] }
					})
				);
			}
		});
	});
});
