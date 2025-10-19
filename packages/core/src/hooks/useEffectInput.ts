import type { Key } from "ink";
import { useInput } from "ink";
import { useEffect, useState } from "react";

//----------------------
// Types
//----------------------

type InputHandler = {
	do: () => void;
	when: (input: string, key: Key) => boolean;
};

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
const useEffectInput = (handlers: InputHandler[]): void => {
	const [activeHandler, setActiveHandler] = useState<number | undefined>(void 0);

	useEffect(() => {
		if (activeHandler == void 0) return;
		handlers[activeHandler].do();
		setActiveHandler(void 0);
	}, [activeHandler]);

	useInput((input, key) => {
		for (const [index, handler] of handlers.entries()) {
			if (handler.when(input, key)) {
				setActiveHandler(index);
				break;
			}
		}
	});
};

export default useEffectInput;
