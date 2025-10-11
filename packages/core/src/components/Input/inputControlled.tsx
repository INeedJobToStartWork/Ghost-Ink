import { useState } from "react";
import InputUncontrolled from "./inputUncontrolled";
import { TUncontrolledComponent } from "@/types";

//----------------------
// Types
//----------------------

type TInputControlledProps = Omit<Parameters<typeof InputUncontrolled>[0], keyof TUncontrolledComponent<string>> & {
	// value: string;
};

//----------------------
// Functions
//----------------------

/**
 * A controlled version of the {@link InputUncontrolled} component.
 */
export const InputControlled = (props: TInputControlledProps) => {
	const [state, setState] = useState("");

	return InputUncontrolled({
		...props,
		value: state,
		onChange: setState
	});
};

export default InputControlled;
