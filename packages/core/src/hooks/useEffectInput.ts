import type { Key } from "ink";
import { useInput } from "ink";
import { useEffect, useState } from "react";

//----------------------
// Types
//----------------------

type InputHandler = Record<
	string,
	{
		do: (input: string, key: Key) => void;
		when: (input: string, key: Key) => boolean;
	}
>;

//----------------------
// Hook
//----------------------

/**
 * This hook is passing actions to `useEffect` when `when` is triggered by `useInput`.
 * It does solve problem with order of render execution when `useInput` is one rerender before.
 *
 * @example
 * ```ts
 * 	useEffectInput([
 *	    {
 *		    when: (input) => input === "q",
 *		    do: () => {
 *			    console.log("Quit!");
 *			    process.exit(0);
 *		    }
 *	    }
 *	]);
 * ```
 *
 * @see {@link useEffect}
 * @see {@link useInput}
 *
 */
export const useEffectInput = (handlers: InputHandler): void => {
	const [activeHandler, setActiveHandler] = useState<
		{ index: string; useInput: [input: string, key: Key] } | undefined
	>(void 0);

	useEffect(() => {
		if (activeHandler == void 0) return;
		handlers[activeHandler.index].do(activeHandler.useInput[0], activeHandler.useInput[1]);
		setActiveHandler(void 0);
	}, [activeHandler]);

	useInput((input, key) => {
		for (const [index, handler] of Object.entries(handlers)) {
			if (handler.when(input, key)) {
				setActiveHandler({ index: index, useInput: [input, key] });
				break;
			}
		}
	});
};

export default useEffectInput;
