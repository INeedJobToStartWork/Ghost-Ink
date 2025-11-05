/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { describe, expect, test } from "vitest";
import inputMapHandler from "./inputMapHandler";

describe("[FUNCTION] stringReducer", () => {
	describe("[PASS]", () => {
		test("Add To Current inputMap", () => {
			const inputMap = {
				key1: {
					when: () => true,
					do: () => {
						console.log("key1");
					}
				},
				key2: {
					when: () => true,
					do: () => {
						console.log("key2");
					}
				},
				key3: {
					when: () => true,
					do: () => {
						console.log("key3");
					}
				}
			} satisfies Parameters<typeof inputMapHandler>[0];

			const functionToAdd = {
				when: () => true,
				do: () => {
					console.log("key3OOOOO");
				}
			};
			const result = inputMapHandler(inputMap, { key4: functionToAdd });

			expect(result).toBeDefined();
			expect(result).toEqual({ ...inputMap, key4: functionToAdd });
		});
		test("Replace Key at Current inputMap", () => {
			const inputMap = {
				key1: {
					when: () => true,
					do: () => {
						console.log("key1");
					}
				},
				key2: {
					when: () => true,
					do: () => {
						console.log("key2");
					}
				},
				key3: {
					when: () => true,
					do: () => {
						console.log("key3");
					}
				}
			} satisfies Parameters<typeof inputMapHandler>[0];

			const functionToReplace = {
				when: () => true,
				do: () => {
					console.log("key3OOOOO");
				}
			};
			const result = inputMapHandler(inputMap, { key3: functionToReplace });

			expect(result).toBeDefined();
			expect(result).toEqual({ ...inputMap, key3: functionToReplace });
		});
		test.skip("Whitelist - Leave one input handler from `settings`", () => {
			const inputMap = {
				key1: {
					when: () => true,
					do: () => {
						console.log("key1");
					}
				},
				key2: {
					when: () => true,
					do: () => {
						console.log("key2");
					}
				},
				key3: {
					when: () => true,
					do: () => {
						console.log("key3");
					}
				}
			} satisfies Parameters<typeof inputMapHandler>[0];

			const result = inputMapHandler(inputMap, { key1: true, key3: true });

			expect(result).toBeDefined();
			expect(result).toEqual({ key1: inputMap.key1, key3: inputMap.key3 });
		});
		test("Remove one input handler from `settings`", () => {
			const inputMap = {
				key1: {
					when: () => true,
					do: () => {
						console.log("key1");
					}
				},
				key2: {
					when: () => true,
					do: () => {
						console.log("key2");
					}
				}
			} satisfies Parameters<typeof inputMapHandler>[0];

			const result = inputMapHandler(inputMap, { key1: false });

			expect(result).toBeDefined();
			expect(result).toEqual({ key2: inputMap.key2 });
		});
		test("Return `inputMap` if settings is undefined", () => {
			const inputMap = {
				key1: {
					when: () => true,
					do: () => {
						console.log("key1");
					}
				},
				key2: {
					when: () => true,
					do: () => {
						console.log("key2");
					}
				}
			} satisfies Parameters<typeof inputMapHandler>[0];

			const result = inputMapHandler(inputMap, void 0);

			expect(result).toBeDefined();
			expect(result).toEqual(inputMap);
		});
		test("Return `undefined` if settings is false", () => {
			const inputMap = {
				key1: {
					when: () => true,
					do: () => {
						console.log("key1");
					}
				},
				key2: {
					when: () => true,
					do: () => {
						console.log("key2");
					}
				}
			} satisfies Parameters<typeof inputMapHandler>[0];

			const settings = false;
			const result = inputMapHandler(inputMap, settings);

			expect(result).toBeUndefined();
			expect(result).toEqual(void 0);
		});
		test("Return when `settings` is CB function with prevState", () => {
			const inputMap = {
				key1: {
					when: () => true,
					do: () => {
						console.log("key1");
					}
				},
				key2: {
					when: () => true,
					do: () => {
						console.log("key2");
					}
				}
			} satisfies Parameters<typeof inputMapHandler>[0];

			const result = inputMapHandler(inputMap, inputMap => inputMap);

			expect(result).toBeDefined();
			expect(result).toEqual(inputMap);
		});
		test("Return when `settings` is CB function with own inputs", () => {
			const inputMap = {
				key1: {
					when: () => true,
					do: () => {
						console.log("key1");
					}
				},
				key2: {
					when: () => true,
					do: () => {
						console.log("key2");
					}
				}
			} satisfies Parameters<typeof inputMapHandler>[0];

			const settings = () => ({ key2: inputMap.key2 });
			const result = inputMapHandler(inputMap, settings);

			expect(result).toBeDefined();
			expect({ key2: inputMap.key2 }).toEqual(settings());
		});
	});
});
