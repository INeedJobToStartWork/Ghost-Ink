import { optionConfig, optionDebugger } from "@/helpers";
import { program } from "commander";

import React, { useState } from "react";
import { render } from "ink";
import { TextInput } from "@packages/cli";
//----------------------
// Types
//----------------------

//----------------------
// CLI APP
//----------------------

program
	.description("Execute Ghost-ink application")
	.addOption(optionConfig)
	.addOption(optionDebugger)
	.action(() => {
		console.log("HEJ");
		const App = () => {
			const [state, setState] = useState("");
			// <TextInput value={state} onChange={setState} />;
			// return <Text>HEJs</Text>;
			// console.log("AHAHHAHAHAHAH");
			return (
				<TextInput initAutocomplete={[""]} onSubmit={() => console.log("AAAAAA")} value={state} onChange={setState} />
			);
		};

		render(<App />);
	});
