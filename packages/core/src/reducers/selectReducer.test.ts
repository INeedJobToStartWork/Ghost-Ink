/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
import { describe, expect, test } from "vitest";
import type { ISelectionState, TSelectionReducerAction } from "./selectReducer";
import selectReducer, { SELECT_ACTIONS_TYPES, MY_ERROR_LIST } from "./selectReducer"; // dopasuj ścieżkę importu
import { myError } from "oh-my-error";

describe("[FUNCTION] selectReducer", () => {
	describe("[PASS]", () => {
		test("Empty string, selecting Left", () => {
			const action: TSelectionReducerAction = {
				type: SELECT_ACTIONS_TYPES.START_SELECTION,
				payload: { position: 0, direction: "left" }
			};
			const result = selectReducer({}, action);
			expect(result).toEqual({ from: 0, to: 0, max: 0, anchor: 0, direction: "right" });
		});
		test("START_SELECTION sets initial selection with given position and direction", () => {
			const action: TSelectionReducerAction = {
				type: SELECT_ACTIONS_TYPES.START_SELECTION,
				payload: { position: 5, direction: "left" }
			};
			const result = selectReducer({}, action);
			expect(result).toEqual({
				from: 5,
				to: 5,
				anchor: 5,
				direction: "left"
			});
		});

		test("EXTEND_SELECTION extends selection right when position >= anchor", () => {
			const state: ISelectionState = { from: 3, to: 3, anchor: 3, direction: "right" };
			const action: TSelectionReducerAction = {
				type: SELECT_ACTIONS_TYPES.EXTEND_SELECTION,
				payload: { position: 7 }
			};
			const result = selectReducer(state, action);
			expect(result).toEqual({
				from: 3,
				to: 7,
				anchor: 3,
				direction: "right"
			});
		});

		test("EXTEND_SELECTION extends selection left when position < anchor", () => {
			const state: ISelectionState = { from: 5, to: 5, anchor: 5, direction: "right" };
			const action: TSelectionReducerAction = {
				type: SELECT_ACTIONS_TYPES.EXTEND_SELECTION,
				payload: { position: 2 }
			};
			const result = selectReducer(state, action);
			expect(result).toEqual({
				from: 2,
				to: 5,
				anchor: 5,
				direction: "left"
			});
		});

		test("EXTEND_SELECTION initializes selection if from/to undefined", () => {
			const state: ISelectionState = {};
			const action: TSelectionReducerAction = {
				type: SELECT_ACTIONS_TYPES.EXTEND_SELECTION,
				payload: { position: 4, direction: "right" }
			};
			const result = selectReducer(state, action);
			expect(result).toEqual({
				from: 4,
				to: 4,
				anchor: 4,
				direction: "right"
			});
		});

		test("CLEAR_SELECTION clears selection but keeps direction", () => {
			const state: ISelectionState = { from: 3, to: 5, anchor: 3, direction: "left" };
			const action: TSelectionReducerAction = { type: SELECT_ACTIONS_TYPES.CLEAR_SELECTION };
			const result = selectReducer(state, action);
			expect(result).toEqual({
				from: undefined,
				to: undefined,
				anchor: undefined,
				direction: "left"
			});
		});

		test("SELECT_ALL selects from 0 to payload with direction right", () => {
			const action: TSelectionReducerAction = {
				type: SELECT_ACTIONS_TYPES.SELECT_ALL,
				payload: 10
			};
			const result = selectReducer({}, action);
			expect(result).toEqual({
				from: 0,
				to: 10,
				anchor: 0,
				direction: "right"
			});
		});
	});

	describe("[ERROR]", () => {
		test("Unknown action type throws NOT_FOUND_ACTION error", () => {
			try {
				selectReducer(
					{},
					{
						// @ts-expect-error intentionally wrong type
						type: "UNKNOWN_ACTION",
						// @ts-expect-error intentionally payload
						payload: 123
					}
				);
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
