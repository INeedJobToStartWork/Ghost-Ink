import { textRender } from "@/functions";
import { useSelect, useWriting } from "@/hooks";
import { TUncontrolledComponent } from "@/types";
import { Box, Text } from "ink";
import { useEffect } from "react";

//----------------------
// Types
//----------------------

type TInputUncontrolledProps = {
	readonly styles?: Parameters<typeof textRender>[0]["styles"];
	readonly value: string;
	readonly initialValue?: string;
	readonly onSubmit?: (...args: any) => any;
} & TUncontrolledComponent<string>;

//----------------------
// Functions
//----------------------

/**
 * Text Input
 *
 * @example
 * ```
 * import { useState } from "react"
 * const [state, setState] = useState("");
 *
 * <InputUncontrolled
 *   value={state}
 *   onChange={setState}
 *   onSubmit={(val) => console.log("Submitted:", val)}
 *   styles={[
 *     { start: 0, end: 1, tag: 'Text', props: { color: 'green' } }
 *   ]}
 * />
 * ```
 *
 * Built with:
 * @see {@link useWriting}
 * @see {@link useSelect}
 * @see {@link textRender}
 *
 */
export const InputUncontrolled = (props: TInputUncontrolledProps) => {
	const writingReturn = useWriting();
	const [[state]] = writingReturn;
	useSelect(writingReturn);

	//----------------------
	// Inputs
	//----------------------

	useEffect(() => {
		props.onChange(state);
	}, [state]);

	const renderedValue = textRender({
		text: state,
		styles: props.styles ?? []
	});

	return (
		<Box>
			<Text>{renderedValue}</Text>
			{/* <Text> | Cursor:{cursorState.cursorPosition}</Text>
			<Text> | Selection:{JSON.stringify(selectionState)}</Text> */}
		</Box>
	);
};

export default InputUncontrolled;
