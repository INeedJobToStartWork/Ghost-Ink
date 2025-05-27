import { optionConfig, optionDebugger } from "@/helpers";
import { program } from "commander";

import React, { useState } from "react";
import { render } from "ink";
// TODO: FIX ERROR - It's exported but ts do not see that
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

			return <TextInput onSubmit={() => console.log("AAAAAA")} value={state} onChange={setState} />;
		};

		render(<App />);
	});
