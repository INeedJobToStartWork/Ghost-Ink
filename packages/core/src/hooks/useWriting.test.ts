// /* eslint-disable @typescript-eslint/no-unsafe-member-access */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// /* eslint-disable @typescript-eslint/require-await */
// import { act, renderHook } from "@testing-library/react";
// import { vi, describe, test, expect, beforeEach } from "vitest";
// import { useInput } from "ink";
// import { useWriting } from "@/hooks"; // dostosuj ścieżkę
// import { useState } from "react";

import { test } from "vitest";

// vi.mock("ink", async () => {
// 	const original = await vi.importActual<typeof import("ink")>("ink");
// 	return {
// 		...original,
// 		useInput: vi.fn()
// 	};
// });

// describe("[HOOK] useWriting", () => {
// 	let inputHandler: Parameters<typeof useInput>[0];

// 	beforeEach(() => {
// 		(useInput as unknown as vi.Mock).mockImplementation(handler => {
// 			inputHandler = handler;
// 		});
// 	});

// 	test("initial state is empty string and cursor 0", () => {
// 		const { result, rerender } = renderHook(() => useWriting());
// 		const [[text], [cursor]] = result.current;

// 		expect(text).toBe("");
// 		expect(cursor).toBe(0);
// 	});
// 	test("initial state is empty string and cursor w0", () => {
// 		const { result, rerender } = renderHook(() => useState("asd"));

// 		// Początkowy stan
// 		let [text, setState] = result.current;
// 		expect(text).toBe("asd");

// 		// Ustawiamy "asd" (bez zmiany, ale wywołujemy dla przykładu)
// 		act(() => {
// 			setState("asd");
// 		});
// 		rerender();

// 		expect(text).toBe("asd");

// 		// Ustawiamy nową wartość "asdg"
// 		act(() => {
// 			setState("asdg");
// 		});
// 		rerender();

// 		// Ponownie odczytujemy aktualny stan
// 		[text, setState] = result.current;
// 		expect(text).toBe("asdg");
// 	});

// 	test("adds characters and moves cursor forward", () => {
// 		const { result } = renderHook(() => useWriting());
// 		const [[text], [cursor]] = result.current;
// 		act(() => {
// 			inputHandler("a", {
// 				ctrl: false,
// 				meta: false,
// 				upArrow: false,
// 				downArrow: false,
// 				leftArrow: false,
// 				rightArrow: false,
// 				pageDown: false,
// 				pageUp: false,
// 				return: false,
// 				escape: false,
// 				shift: false,
// 				tab: false,
// 				backspace: false,
// 				delete: false
// 			});
// 			inputHandler("b", {
// 				ctrl: false,
// 				meta: false,
// 				upArrow: false,
// 				downArrow: false,
// 				leftArrow: false,
// 				rightArrow: false,
// 				pageDown: false,
// 				pageUp: false,
// 				return: false,
// 				escape: false,
// 				shift: false,
// 				tab: false,
// 				backspace: false,
// 				delete: false
// 			});
// 			inputHandler("c", {
// 				ctrl: false,
// 				meta: false,
// 				upArrow: false,
// 				downArrow: false,
// 				leftArrow: false,
// 				rightArrow: false,
// 				pageDown: false,
// 				pageUp: false,
// 				return: false,
// 				escape: false,
// 				shift: false,
// 				tab: false,
// 				backspace: false,
// 				delete: false
// 			});
// 			inputHandler("c", {
// 				ctrl: false,
// 				meta: false,
// 				upArrow: false,
// 				downArrow: false,
// 				leftArrow: false,
// 				rightArrow: false,
// 				pageDown: false,
// 				pageUp: false,
// 				return: false,
// 				escape: false,
// 				shift: false,
// 				tab: false,
// 				backspace: false,
// 				delete: false
// 			});
// 			inputHandler("c", {
// 				ctrl: false,
// 				meta: false,
// 				upArrow: false,
// 				downArrow: false,
// 				leftArrow: false,
// 				rightArrow: false,
// 				pageDown: false,
// 				pageUp: false,
// 				return: false,
// 				escape: false,
// 				shift: false,
// 				tab: false,
// 				backspace: false,
// 				delete: false
// 			});
// 			inputHandler("c", {
// 				ctrl: false,
// 				meta: false,
// 				upArrow: false,
// 				downArrow: false,
// 				leftArrow: false,
// 				rightArrow: false,
// 				pageDown: false,
// 				pageUp: false,
// 				return: false,
// 				escape: false,
// 				shift: false,
// 				tab: false,
// 				backspace: false,
// 				delete: false
// 			});
// 		});
// 		act(() => {
// 			// expect(text).toBe("abc");
// 			expect(cursor).toBe(3);
// 		});
// 	});

// 	// test("moves cursor left and right", () => {
// 	// 	const { result } = renderHook(() => useWriting());

// 	// 	act(() => {
// 	// 		inputHandler("a", {
// 	// 			ctrl: false,
// 	// 			meta: false,
// 	// 			upArrow: false,
// 	// 			downArrow: false,
// 	// 			leftArrow: false,
// 	// 			rightArrow: false,
// 	// 			pageDown: false,
// 	// 			pageUp: false,
// 	// 			return: false,
// 	// 			escape: false,
// 	// 			shift: false,
// 	// 			tab: false,
// 	// 			backspace: false,
// 	// 			delete: false
// 	// 		});
// 	// 		inputHandler("b", {
// 	// 			ctrl: false,
// 	// 			meta: false,
// 	// 			upArrow: false,
// 	// 			downArrow: false,
// 	// 			leftArrow: false,
// 	// 			rightArrow: false,
// 	// 			pageDown: false,
// 	// 			pageUp: false,
// 	// 			return: false,
// 	// 			escape: false,
// 	// 			shift: false,
// 	// 			tab: false,
// 	// 			backspace: false,
// 	// 			delete: false
// 	// 		});
// 	// 	});

// 	// 	expect(result.current[1][0]).toBe(2);

// 	// 	act(() => {
// 	// 		inputHandler("", {
// 	// 			leftArrow: true,
// 	// 			upArrow: false,
// 	// 			downArrow: false,
// 	// 			rightArrow: false,
// 	// 			pageDown: false,
// 	// 			pageUp: false,
// 	// 			return: false,
// 	// 			escape: false,
// 	// 			ctrl: false,
// 	// 			shift: false,
// 	// 			tab: false,
// 	// 			backspace: false,
// 	// 			delete: false,
// 	// 			meta: false
// 	// 		});
// 	// 	});
// 	// 	expect(result.current[1][0]).toBe(1);

// 	// 	act(() => {
// 	// 		inputHandler("", {
// 	// 			rightArrow: true,
// 	// 			upArrow: false,
// 	// 			downArrow: false,
// 	// 			leftArrow: false,
// 	// 			pageDown: false,
// 	// 			pageUp: false,
// 	// 			return: false,
// 	// 			escape: false,
// 	// 			ctrl: false,
// 	// 			shift: false,
// 	// 			tab: false,
// 	// 			backspace: false,
// 	// 			delete: false,
// 	// 			meta: false
// 	// 		});
// 	// 	});
// 	// 	expect(result.current[1][0]).toBe(2);
// 	// });

// 	// test("inserts character in the middle", () => {
// 	// 	const { result } = renderHook(() => useWriting());

// 	// 	act(() => {
// 	// 		inputHandler("a", {
// 	// 			ctrl: false,
// 	// 			meta: false,
// 	// 			upArrow: false,
// 	// 			downArrow: false,
// 	// 			leftArrow: false,
// 	// 			rightArrow: false,
// 	// 			pageDown: false,
// 	// 			pageUp: false,
// 	// 			return: false,
// 	// 			escape: false,
// 	// 			shift: false,
// 	// 			tab: false,
// 	// 			backspace: false,
// 	// 			delete: false
// 	// 		});
// 	// 		inputHandler("c", {
// 	// 			ctrl: false,
// 	// 			meta: false,
// 	// 			upArrow: false,
// 	// 			downArrow: false,
// 	// 			leftArrow: false,
// 	// 			rightArrow: false,
// 	// 			pageDown: false,
// 	// 			pageUp: false,
// 	// 			return: false,
// 	// 			escape: false,
// 	// 			shift: false,
// 	// 			tab: false,
// 	// 			backspace: false,
// 	// 			delete: false
// 	// 		});
// 	// 	});

// 	// 	// Cursor: "ac" | position = 2
// 	// 	act(() => {
// 	// 		inputHandler("", {
// 	// 			leftArrow: true,
// 	// 			upArrow: false,
// 	// 			downArrow: false,
// 	// 			rightArrow: false,
// 	// 			pageDown: false,
// 	// 			pageUp: false,
// 	// 			return: false,
// 	// 			escape: false,
// 	// 			ctrl: false,
// 	// 			shift: false,
// 	// 			tab: false,
// 	// 			backspace: false,
// 	// 			delete: false,
// 	// 			meta: false
// 	// 		}); // position = 1
// 	// 	});

// 	// 	// Insert "b" at index 1 -> "abc"
// 	// 	act(() => {
// 	// 		inputHandler("b", {
// 	// 			ctrl: false,
// 	// 			meta: false,
// 	// 			upArrow: false,
// 	// 			downArrow: false,
// 	// 			leftArrow: false,
// 	// 			rightArrow: false,
// 	// 			pageDown: false,
// 	// 			pageUp: false,
// 	// 			return: false,
// 	// 			escape: false,
// 	// 			shift: false,
// 	// 			tab: false,
// 	// 			backspace: false,
// 	// 			delete: false
// 	// 		});
// 	// 	});

// 	// 	const [[text], [cursor]] = result.current;

// 	// 	expect(text).toBe("abc");
// 	// 	expect(cursor).toBe(2); // moved right by 1 after insert
// 	// });

// 	// test("backspace deletes char before cursor and moves cursor back", () => {
// 	// 	const { result } = renderHook(() => useWriting());

// 	// 	act(() => {
// 	// 		inputHandler("x", {
// 	// 			ctrl: false,
// 	// 			meta: false,
// 	// 			upArrow: false,
// 	// 			downArrow: false,
// 	// 			leftArrow: false,
// 	// 			rightArrow: false,
// 	// 			pageDown: false,
// 	// 			pageUp: false,
// 	// 			return: false,
// 	// 			escape: false,
// 	// 			shift: false,
// 	// 			tab: false,
// 	// 			backspace: false,
// 	// 			delete: false
// 	// 		});
// 	// 		inputHandler("y", {
// 	// 			ctrl: false,
// 	// 			meta: false,
// 	// 			upArrow: false,
// 	// 			downArrow: false,
// 	// 			leftArrow: false,
// 	// 			rightArrow: false,
// 	// 			pageDown: false,
// 	// 			pageUp: false,
// 	// 			return: false,
// 	// 			escape: false,
// 	// 			shift: false,
// 	// 			tab: false,
// 	// 			backspace: false,
// 	// 			delete: false
// 	// 		});
// 	// 		inputHandler("z", {
// 	// 			ctrl: false,
// 	// 			meta: false,
// 	// 			upArrow: false,
// 	// 			downArrow: false,
// 	// 			leftArrow: false,
// 	// 			rightArrow: false,
// 	// 			pageDown: false,
// 	// 			pageUp: false,
// 	// 			return: false,
// 	// 			escape: false,
// 	// 			shift: false,
// 	// 			tab: false,
// 	// 			backspace: false,
// 	// 			delete: false
// 	// 		});
// 	// 	});

// 	// 	// Cursor at 3 ("xyz")
// 	// 	act(() => {
// 	// 		inputHandler("", {
// 	// 			leftArrow: true,
// 	// 			upArrow: false,
// 	// 			downArrow: false,
// 	// 			rightArrow: false,
// 	// 			pageDown: false,
// 	// 			pageUp: false,
// 	// 			return: false,
// 	// 			escape: false,
// 	// 			ctrl: false,
// 	// 			shift: false,
// 	// 			tab: false,
// 	// 			backspace: false,
// 	// 			delete: false,
// 	// 			meta: false
// 	// 		}); // pos = 2
// 	// 		inputHandler("", {
// 	// 			backspace: true,
// 	// 			upArrow: false,
// 	// 			downArrow: false,
// 	// 			leftArrow: false,
// 	// 			rightArrow: false,
// 	// 			pageDown: false,
// 	// 			pageUp: false,
// 	// 			return: false,
// 	// 			escape: false,
// 	// 			ctrl: false,
// 	// 			shift: false,
// 	// 			tab: false,
// 	// 			delete: false,
// 	// 			meta: false
// 	// 		}); // remove "y"
// 	// 	});

// 	// 	const [[text], [cursor]] = result.current;

// 	// 	expect(text).toBe("xz");
// 	// 	expect(cursor).toBe(1);
// 	// });

// 	// test("delete key removes char at cursor but doesn't move cursor", () => {
// 	// 	const { result } = renderHook(() => useWriting());

// 	// 	act(() => {
// 	// 		inputHandler("1", {
// 	// 			ctrl: false,
// 	// 			meta: false,
// 	// 			upArrow: false,
// 	// 			downArrow: false,
// 	// 			leftArrow: false,
// 	// 			rightArrow: false,
// 	// 			pageDown: false,
// 	// 			pageUp: false,
// 	// 			return: false,
// 	// 			escape: false,
// 	// 			shift: false,
// 	// 			tab: false,
// 	// 			backspace: false,
// 	// 			delete: false
// 	// 		});
// 	// 		inputHandler("2", {
// 	// 			ctrl: false,
// 	// 			meta: false,
// 	// 			upArrow: false,
// 	// 			downArrow: false,
// 	// 			leftArrow: false,
// 	// 			rightArrow: false,
// 	// 			pageDown: false,
// 	// 			pageUp: false,
// 	// 			return: false,
// 	// 			escape: false,
// 	// 			shift: false,
// 	// 			tab: false,
// 	// 			backspace: false,
// 	// 			delete: false
// 	// 		});
// 	// 		inputHandler("3", {
// 	// 			ctrl: false,
// 	// 			meta: false,
// 	// 			upArrow: false,
// 	// 			downArrow: false,
// 	// 			leftArrow: false,
// 	// 			rightArrow: false,
// 	// 			pageDown: false,
// 	// 			pageUp: false,
// 	// 			return: false,
// 	// 			escape: false,
// 	// 			shift: false,
// 	// 			tab: false,
// 	// 			backspace: false,
// 	// 			delete: false
// 	// 		});
// 	// 	});

// 	// 	// "123", cursor at 3
// 	// 	act(() => {
// 	// 		inputHandler("", {
// 	// 			leftArrow: true,
// 	// 			upArrow: false,
// 	// 			downArrow: false,
// 	// 			rightArrow: false,
// 	// 			pageDown: false,
// 	// 			pageUp: false,
// 	// 			return: false,
// 	// 			escape: false,
// 	// 			ctrl: false,
// 	// 			shift: false,
// 	// 			tab: false,
// 	// 			backspace: false,
// 	// 			delete: false,
// 	// 			meta: false
// 	// 		}); // pos = 2
// 	// 		inputHandler("", {
// 	// 			leftArrow: true,
// 	// 			upArrow: false,
// 	// 			downArrow: false,
// 	// 			rightArrow: false,
// 	// 			pageDown: false,
// 	// 			pageUp: false,
// 	// 			return: false,
// 	// 			escape: false,
// 	// 			ctrl: false,
// 	// 			shift: false,
// 	// 			tab: false,
// 	// 			backspace: false,
// 	// 			delete: false,
// 	// 			meta: false
// 	// 		}); // pos = 1
// 	// 		inputHandler("", {
// 	// 			delete: true,
// 	// 			upArrow: false,
// 	// 			downArrow: false,
// 	// 			leftArrow: false,
// 	// 			rightArrow: false,
// 	// 			pageDown: false,
// 	// 			pageUp: false,
// 	// 			return: false,
// 	// 			escape: false,
// 	// 			ctrl: false,
// 	// 			shift: false,
// 	// 			tab: false,
// 	// 			backspace: false,
// 	// 			meta: false
// 	// 		}); // delete "2"
// 	// 	});

// 	// 	const [[text], [cursor]] = result.current;

// 	// 	expect(text).toBe("13");
// 	// 	expect(cursor).toBe(1); // unchanged
// 	// });
// });

test("temporary", () => "");
