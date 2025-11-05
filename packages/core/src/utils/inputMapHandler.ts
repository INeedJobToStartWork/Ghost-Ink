import type { TInputHandler, useEffectInput } from "@/hooks";

//----------------------
// Types
//----------------------

// TODO: Extra Narrowing cuz we know output
// /** @dontexport */
// type TOutput<
// 	T extends Parameters<typeof useEffectInput>[0],
// 	G extends Record<string & keyof T, TInputHandler | false> | false
// > = G extends false ? undefined : Parameters<typeof useEffectInput>[0];

//----------------------
// Functions
//----------------------

/**
 * Input Map Handler
 *
 * @description Utility function to handle input map settings at component level for {@link useEffectInput}
 *
 * @param inputMap - The input map object for {@link useEffectInput}
 * @param settings - The settings object to handle the input map
 *
 * @example
 * ```ts
 * useEffectInput(
 *		inputMapHandler(
 *			INPUT_LISTENERS_XCOMPONENT(...),
 *			options?.inputMap
 *	)
 * );
 * ```
 * If `settings`:
 * - Is `function` - Return will be `settings(inputMap)`
 * - Is `undefined` - Return will be `inputMap`
 * - Is `false` - Return will be `void 0`
 * - Is `object` and value of `key` is:
 * 	- `true` - Keep the handler
 * 	- `false` or any falsy value - Delete the handler
 * 	- `function` or any truthy value - Set the handler to this values (Will overwrite existing handler)
 *
 * @return The input map handler object for {@link useEffectInput}
 * @see {@link useEffectInput}
 */
export const inputMapHandler = <T extends Parameters<typeof useEffectInput>[0]>(
	inputMap: T,
	settings:
		| Partial<Record<keyof T | (string & {}), TInputHandler | boolean>>
		| false
		| ((inputMap: T) => Parameters<typeof useEffectInput>[0])
		| undefined
): Parameters<typeof useEffectInput>[0] => {
	if (settings == void 0) return inputMap;
	if (!settings) return void 0;
	if (typeof settings === "function") return settings(inputMap);

	let result: Parameters<typeof useEffectInput>[0] = { ...inputMap };

	for (const key of Object.keys(settings)) {
		const handler: (typeof settings)[keyof typeof settings] = settings[key as keyof typeof settings];
		if (handler === true) continue;
		else if (handler) result[key] = handler;
		else delete result[key];
	}

	return result;
};

export default inputMapHandler;
