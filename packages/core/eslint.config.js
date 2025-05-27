import ineedj from "@ineedj/eslintrc";

export default ineedj({
	formatters: {
		json: false,
		stylistic: false,
		stylisticJSX: false,
		stylisticTS: false,
		perfectionistSorters: false
	},
	modifiers: {
		commands: true
	},
	syntax: {
		vitest: true,
		eslint: true,
		jsx: true,
		next: false,
		node: true,
		react: true,
		storybook: false,
		tailwindcss: false,
		typescript: true,
		toml: false,
		yaml: false,
		ignoreGlobalFiles: { gitIgnore: true, basicIgnores: true }
	}
}).removeRules(
	"@typescript-eslint/no-throw-literal" /** Use custom Error */,
	"@EslintSecurity/detect-object-injection",
	"MD010/no-hard-tabs",
	"@EslintTSDocs/syntax",
	"@EslintNode/no-process-env",
	"@EslintNode/no-process-exit",
	"@EslintUnicorn/no-process-exit",
	"@EslintNode/hashbang",
	"@typescript-eslint/explicit-module-boundary-types",
	"@EslintReact/jsx-filename-extension", // Temporary off cuz config error
	"@EslintReact/jsx-no-leaked-render", // Temporary off cuz config error
	"@EslintReact/jsx-no-literals", // Temporary off cuz config error
	"@EslintReactHooks/rules-of-hooks", // Temporary off cuz config error: Could not find plugin "@EslintReactHooks".
	"@EslintReactHooks/exhaustive-deps", // Temporary off cuz config error:  Could not find plugin "@EslintReactHooks"
	"@EslintReact/destructuring-assignment",
	"new-cap"
);
