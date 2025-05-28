//----------------------
// Types
//----------------------

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
	onChange: (...args: any) => any;
	value: T;
};
