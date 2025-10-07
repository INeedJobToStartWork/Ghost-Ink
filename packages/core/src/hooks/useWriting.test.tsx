import { describe, expect, test } from "vitest";
import { renderHook } from "@testing-library/react";
import { render } from "ink-testing-library";
import useWriting from "./useWriting";
import { Text } from "ink";
import { KEY_CODES, pressKeyCreator } from "@packages/test-utils";

describe("[HOOK] useWriting", () => {
	test("initial state is empty string and cursor 0", () => {
		const { result } = renderHook(() => useWriting());
		const [[text], [cursor]] = result.current;
		expect(text).toBe("");
		expect(cursor).toBe(0);
	});
	test("updates value when input is typed", async () => {
		const TestInput = () => {
			const [[textState], [cursorState]] = useWriting();
			return (
				<Text>
					{textState} {cursorState}
				</Text>
			);
		};

		const { lastFrame, stdin } = render(<TestInput />);
		const pressKey = pressKeyCreator(stdin);

		await pressKey("H");
		await pressKey("e");
		await pressKey("l");
		await pressKey("l");
		await pressKey("o");
		await pressKey(" ");
		await pressKey("W");
		await pressKey("o");
		await pressKey("r");
		await pressKey("l");
		await pressKey("d");
		await pressKey("!");

		await pressKey(KEY_CODES.Backspace);
		await pressKey(KEY_CODES.ArrowLeft);
		await pressKey(KEY_CODES.ArrowLeft);
		await pressKey(KEY_CODES.Delete);
		await pressKey(KEY_CODES.Delete);

		expect(lastFrame()).toBe("Hello Wod 9");
	});
	// test("initial state is empty string and cursor 0",()=>{})
	// test("adds characters and moves cursor forward",()=>{})
	// test("moves cursor left and right",()=>{})
	// test("inserts character in the middle",()=>{})
	// test("backspace deletes char before cursor and moves cursor back",()=>{})
	// test("delete key removes char at cursor but doesn't move cursor",()=>{})
});
