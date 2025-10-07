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
  Escape: "\u001b",
  Space: " ",

  Delete: "\u007f",
  Insert: "\u0016",
  Home: "\u0001",
  End: "\u0005",
  PageUp: "\u0010",
  PageDown: "\u0004",

  ArrowUp: "\u001b[A",
  ArrowDown: "\u001b[B",
  ArrowLeft: "\u001b[D",
  ArrowRight: "\u001b[C"
} as const;


export default CODE_ESCAPES;
