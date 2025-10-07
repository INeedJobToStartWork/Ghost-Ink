import { render } from "ink-testing-library";

//----------------------
// Functions
//----------------------

/**
 * Creates a function to press keys on the stdin
 *
 * @example
 * ```ts
 * const { lastFrame, stdin } = render(<TestInput />);
 * const pressKey = pressKeyCreator(stdin);
 * await pressKey("H");
 * await pressKey("e");
 * await pressKey("l");
 * await pressKey("l");
 * await pressKey("o");
 * ```
 *
 * @param stdin - The stdin to press keys on (from ink `render`)
 * @internal @dontexport
 */
export const pressKeyCreator = (stdin: ReturnType<typeof render>["stdin"]) => async (text: string) => {
	await new Promise(resolve => {
		setTimeout(resolve, 10);
	});
	await stdin.write(text);
};

export default pressKeyCreator;
