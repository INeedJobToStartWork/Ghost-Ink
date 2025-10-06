import { defineConfig } from "tsup";
import copy from "esbuild-plugin-copy";
import { addNodeRequireShim } from "./internals";

//----------------------
// Functions
//----------------------

/** @internal */
export const BasicConfig = (isDev: boolean) =>
	({
		METAFILES_TO_COPY: {
			entry: ["src/index.ts"],
			esbuildPlugins: [
				copy({
					assets: [
						{ from: "./package.json", to: "./package.json" },
						{ from: "./.npmrc", to: "./.npmrc" },
						{ from: "./.npmignore", to: "./.npmignore" },
						{ from: "./README.md", to: "./README.md" }
					]
				})
			]
		},
		PACKAGE: {
			entry: ["src/index.ts"],
			clean: true,
			outDir: "dist",
			target: "es2020",
			banner: addNodeRequireShim,
			dts: true,
			format: ["esm", "cjs"]
		}
	}) as const satisfies Record<string, Parameters<typeof defineConfig>[number]>;

/** @internal */
export const devConfigs = BasicConfig(true);

/** @internal */
export const prodConfigs = BasicConfig(false);
