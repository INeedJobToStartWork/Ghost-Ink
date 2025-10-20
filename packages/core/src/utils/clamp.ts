/**
 * Clamp a value between a minimum and maximum value.
 *
 * @example
 *```ts
 * clamp(5, 0, 10) // 5
 * clamp(-5, 0, 10) // 0
 * clamp(15, 0, 10) // 10
 *```
 * @internal @dontexport
 */

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
export default clamp;
