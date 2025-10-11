import { describe, expect, test } from "vitest";
import { render } from "ink-testing-library";
import { InputUncontrolled } from "./inputUncontrolled";
import { CODE_ESCAPES, pressKeyCreator } from "@packages/test-utils";
import { useState } from "react";

//----------------------
// Tests
//----------------------

describe("[Component] inputUncontrolled", () => {
	test.only("Add few letter", async () => {
		const TestInput = () => {
			const [state, setState] = useState("");
			return <InputUncontrolled initAutocomplete={[]} onChange={setState} value={state} />;
		};

		const { lastFrame, stdin } = render(<TestInput />);
		const pressKey = pressKeyCreator(stdin);

		await pressKey("H");
		await pressKey("E");
		await pressKey("L");
		await pressKey("L");
		await pressKey("O");
		await pressKey(CODE_ESCAPES.ArrowLeft);
		await pressKey(CODE_ESCAPES.ArrowLeft);
		await pressKey("Y");
		await pressKey("O");

		expect(lastFrame()).toBe("HELYOLO");
	});
	test("Add few letter and remove 2", async () => {
		const TestInput = () => {
			const [state, setState] = useState("");
			return <InputUncontrolled initAutocomplete={[]} onChange={setState} value={state} />;
		};

		const { lastFrame, stdin } = render(<TestInput />);
		const pressKey = pressKeyCreator(stdin);

		await pressKey("a");
		await pressKey("s");
		await pressKey("d");
		await pressKey(CODE_ESCAPES.Backspace);
		await pressKey(CODE_ESCAPES.Backspace);

		expect(lastFrame()).toBe("a");
	});
	test.skip("Add few letter and remove 2 at mid", async () => {
		const TestInput = () => {
			const [state, setState] = useState("");
			return <InputUncontrolled initAutocomplete={[]} onChange={setState} value={state} />;
		};

		const { lastFrame, stdin } = render(<TestInput />);
		const pressKey = pressKeyCreator(stdin);

		await pressKey("H");
		await pressKey("E");
		await pressKey("L");
		await pressKey("L");
		await pressKey("O");
		await pressKey(CODE_ESCAPES.ArrowLeft);
		await pressKey(CODE_ESCAPES.ArrowLeft);
		await pressKey(CODE_ESCAPES.ArrowLeft);
		await pressKey(CODE_ESCAPES.Backspace);

		expect(lastFrame()).toBe("HLLO");
	});
});
