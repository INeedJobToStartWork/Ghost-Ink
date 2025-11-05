import type { Key } from "ink";
import { useInput } from "ink";
import { useEffect, useState } from "react";

//----------------------
// Types
//----------------------
/**
 * This type defines the structure of an input handler.
 * Each handler has two properties:
 * - `do`: A function that performs the action when the `when` condition is met.
 * - `when`: A function that determines whether the `do` action should be performed.
 */
// type InputHandler = Record<
// 	string,
// 	{
// 		/** A function that performs the action when the `when` condition is met. */
// 		do: (input: string, key: Key) => void;
// 		/** A function that determines whether the `do` action should be performed. */
// 		when: (input: string, key: Key) => boolean;
// 	}
// >;
export type TInputHandler = {
	/** A function that performs the action when the `when` condition is met. */
	do: (input: string, key: Key) => void;
	/** A function that determines whether the `do` action should be performed. */
	when: (input: string, key: Key) => boolean;
};

/**
 * This type defines the structure of an input handler map.
 *
 * @see {@link TInputHandler}
 */
export type TInputHandlerMap = Record<string, TInputHandler | undefined>;

//----------------------
// Functions
//----------------------

/**
 * This hook is passing actions to {@link useEffect} when `when` is triggered by {@link useInput}.
 * It does solve problem with order of render execution when {@link useInput} is one rerender before.
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
export const useEffectInput = (handlers: TInputHandlerMap | undefined): void => {
	if (handlers == void 0) return;
	const [activeHandler, setActiveHandler] = useState<
		{ index: string; useInput: [input: string, key: Key] } | undefined
	>(void 0);

	useEffect(() => {
		if (activeHandler == void 0) return;
		handlers[activeHandler.index]?.do(activeHandler.useInput[0], activeHandler.useInput[1]);
		setActiveHandler(void 0);
	}, [activeHandler]);

	useInput((input, key) => {
		for (const [index, handler] of Object.entries(handlers)) {
			if (handler == void 0) continue;
			if (handler.when(input, key)) {
				setActiveHandler({ index: index, useInput: [input, key] });
				break;
			}
		}
	});
};

export default useEffectInput;
