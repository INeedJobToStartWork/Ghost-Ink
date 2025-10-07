import { describe, expect, it } from "vitest";
import pressKeyCreator from "./pressKeyCreator";
import { Text, useInput } from "ink";
import { render } from "ink-testing-library";
import { useState } from "react";

//----------------------
// Tests
//----------------------

describe("pressKeyCreator", () => {
	it("should press keys on the stdin", async () => {
		const TestInput = () => {
			const [text, setText] = useState("");

			useInput(key => {
				// Add Text
				setText(prev => prev + key);
			});

			return <Text>{text}</Text>;
		};

		const { lastFrame, stdin } = render(<TestInput />);
		const pressKey = pressKeyCreator(stdin);
		await pressKey("H");
		await pressKey("e");
		await pressKey("l");
		await pressKey("l");
		await pressKey("o");
		expect(lastFrame()).toBe("Hello");
	});
});
