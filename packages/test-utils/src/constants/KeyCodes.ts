//----------------------
// CONSTANTS
//----------------------

/**
 * Unicode key codes
 * @internal @dontexport
 */
export const KEY_CODES = {
	Backspace: "\b",
	Tab: "\t",
	Enter: "\n",
	Return: "\r",
	Escape: "\u001b",
	Space: " ",

	Delete: "\u007f",
	Insert: "\u0016",
	Home: "\u0001",
	End: "\u0005",
	PageUp: "\u0010",
	PageDown: "\u0004",

	ArrowUp: "\u001e",
	ArrowDown: "\u001f",
	ArrowLeft: "\u001c",
	ArrowRight: "\u001d"
} as const;

export default KEY_CODES;
