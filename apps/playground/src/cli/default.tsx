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
		const App = () => {
			return <TextInput initAutocomplete={[""]} />;
		};

		render(<App />);
	});
