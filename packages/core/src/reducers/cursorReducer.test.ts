/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
import { describe, expect, test } from "vitest";
import { cursorReducer, CURSOR_ACTIONS_TYPES, MY_ERROR_LIST } from "./cursorReducer";
import { myError } from "oh-my-error";

describe("[FUNCTION] cursorReducer", () => {
	describe("[PASS]", () => {
		test("SET_POSITION sets exact value", () => {
			const result = cursorReducer(5, {
				type: CURSOR_ACTIONS_TYPES.SET_POSITION,
				payload: 10
			});
			expect(result).toBe(10);
		});

		test("MOVE_CURSOR forward within bounds", () => {
			const result = cursorReducer(5, {
				type: CURSOR_ACTIONS_TYPES.MOVE_CURSOR,
				payload: 3,
				max: 10
			});
			expect(result).toBe(8);
		});

		test("MOVE_CURSOR forward exceeds max", () => {
			const result = cursorReducer(8, {
				type: CURSOR_ACTIONS_TYPES.MOVE_CURSOR,
				payload: 5,
				max: 10
			});
			expect(result).toBe(10);
		});

		test("MOVE_CURSOR backward without max", () => {
			const result = cursorReducer(5, {
				type: CURSOR_ACTIONS_TYPES.MOVE_CURSOR,
				payload: -2
			});
			expect(result).toBe(3);
		});

		test("MOVE_CURSOR backward underflow clamps to 0", () => {
			const result = cursorReducer(2, {
				type: CURSOR_ACTIONS_TYPES.MOVE_CURSOR,
				payload: -10
			});
			expect(result).toBe(0);
		});

		test("MOVE_TO_START resets to 0", () => {
			const result = cursorReducer(15, {
				type: CURSOR_ACTIONS_TYPES.MOVE_TO_START
			});
			expect(result).toBe(0);
		});

		test("MOVE_TO_END sets to provided value", () => {
			const result = cursorReducer(3, {
				type: CURSOR_ACTIONS_TYPES.MOVE_TO_END,
				payload: 99
			});
			expect(result).toBe(99);
		});
	});

	describe("[ERROR]", () => {
		test("MOVE_CURSOR forward without max throws MISSING_PROPERTY", () => {
			try {
				//@ts-expect-error Expect to do not have `max`
				cursorReducer(5, {
					type: CURSOR_ACTIONS_TYPES.MOVE_CURSOR,
					payload: 2
				});
			} catch (error) {
				expect(error).toEqual(
					myError(MY_ERROR_LIST.MISSING_PROPERTY, {
						message: { dev: ["max"] },
						hint: { dev: ["If payload it's > 0 - Define max value"] }
					})
				);
			}
		});

		test("Unknown action type throws NOT_FOUND_ACTION", () => {
			try {
				cursorReducer(0, {
					// @ts-expect-error: intentionally wrong type
					type: "UNKNOWN_ACTION",
					payload: 123
				});
			} catch (error) {
				expect(error).toEqual(
					myError(MY_ERROR_LIST.NOT_FOUND_ACTION, {
						message: { dev: ["UNKNOWN_ACTION"] }
					})
				);
			}
		});
	});
});
