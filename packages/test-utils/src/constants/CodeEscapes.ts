//----------------------
// CONSTANTS
//----------------------

/**
 * Code Escapes
 * @internal @dontexport
 */
export const CODE_ESCAPES = {
	Backspace: "\b",
	Tab: "\t",
	Enter: "\n",
	Return: "\r",
	Escape: "\u001B",
	Space: " ",

	Delete: "\u007F",
	Insert: "\u0016",
	Home: "\u0001",
	End: "\u0005",
	PageUp: "\u0010",
	PageDown: "\u0004",

	ArrowUp: "\u001B[A",
	ArrowDown: "\u001B[B",
	ArrowLeft: "\u001B[D",
	ArrowRight: "\u001B[C"
} as const;

export default CODE_ESCAPES;
