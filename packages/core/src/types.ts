//----------------------
// Types
//----------------------

import type { Dispatch } from "react";

/**
 * ONLY TO USE IN DEVELOPMENT
 * @internal @dontexport
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TTODO = any;

/**
 * Checks if a number is negative.
 *
 * @example
 * ```ts
 * type A = TIsNegative<-5>; // true
 * type B = TIsNegative<5>;  // false
 * ```
 */
export type TIsNegative<T extends number> = `${T}` extends `-${string}` ? true : false;

/**
 * Uncontrolled component with `value` and `onChange`.
 */
export type TUncontrolledComponent<T> = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onChange: (...args: any) => any;
	value: T;
};

/**
 * Alphabet in lowercase version
 */
export type TAlphabet =
	| "a"
	| "b"
	| "c"
	| "d"
	| "e"
	| "f"
	| "g"
	| "h"
	| "i"
	| "j"
	| "k"
	| "l"
	| "m"
	| "n"
	| "o"
	| "p"
	| "q"
	| "r"
	| "s"
	| "t"
	| "u"
	| "v"
	| "w"
	| "x"
	| "y"
	| "z";

/**
 * Return type of `useReducer`
 *
 * @template T - The reducer function type
 * @dontexport
 */
export type UseReducerReturn<T extends (...args: any[]) => any> = [Parameters<T>[0], Dispatch<Parameters<T>[1]>];
