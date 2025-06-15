import { describe, expect, it } from "vitest";
import stringStoreSystem from "./stringStoreSystem";

describe("[MODULE] stringStoreSystem object API", () => {
	// -------------------------------
	// .add
	// -------------------------------
	describe("[.add]", () => {
		describe("[PASS]", () => {
			it("Should return with added suggestion", () => {
				const result = stringStoreSystem.add({}, ["apple", "banana", "orange"]);
				expect(result).toEqual({ a: new Set(["apple"]), b: new Set(["banana"]), o: new Set(["orange"]) });
			});

			it("Should normalize uppercase letters", () => {
				const result = stringStoreSystem.add({}, ["Apple", "Banana"]);
				expect(result).toEqual({
					a: new Set(["Apple"]),
					b: new Set(["Banana"])
				});
			});

			it("Should put suggestions starting with non-letter into 'other'", () => {
				const result = stringStoreSystem.add({}, ["1apple", "#banana"]);
				expect(result).toEqual({
					other: new Set(["1apple", "#banana"])
				});
			});

			it("Should group suggestions under the same key", () => {
				const result = stringStoreSystem.add({}, ["apple", "apricot"]);
				expect(result).toEqual({
					a: new Set(["apple", "apricot"])
				});
			});

			it("Should avoid duplicates in the same key", () => {
				const result = stringStoreSystem.add({}, ["apple", "apple", "Apple"]);
				expect(result).toEqual({
					a: new Set(["apple", "Apple"])
				});
			});

			it("Should preserve existing state", () => {
				const initial = {
					a: new Set(["apple"]),
					b: new Set(["banana"])
				};
				const result = stringStoreSystem.add(initial, ["avocado", "blueberry"]);
				expect(result).toEqual({
					a: new Set(["apple", "avocado"]),
					b: new Set(["banana", "blueberry"])
				});
			});

			it("Should handle empty suggestion list", () => {
				const initial = { a: new Set(["apple"]) };
				const result = stringStoreSystem.add(initial, []);
				expect(result).toEqual({ a: new Set(["apple"]) });
			});
		});
	});

	// -------------------------------
	// .loader
	// -------------------------------
	describe("[.loader]", () => {
		const state = {
			a: new Set(["apple", "apricot"]),
			b: new Set(["banana"]),
			o: new Set(["orange"]),
			other: new Set(["#crazy", "1start"])
		};

		describe("[PASS]", () => {
			it("Should return all values for empty input", () => {
				const result = stringStoreSystem.loader(state, "");
				expect(result).toEqual(["apple", "apricot", "banana", "orange", "#crazy", "1start"]);
			});

			it("Should return values under specific key", () => {
				const result = stringStoreSystem.loader(state, "apple");
				expect(result).toEqual(["apple", "apricot"]);
			});

			it("Should return empty array for unknown input", () => {
				const result = stringStoreSystem.loader(state, "zzz");
				expect(result).toEqual([]);
			});

			it("Should match key case-insensitively", () => {
				const result = stringStoreSystem.loader(state, "BANANA");
				expect(result).toEqual(["banana"]);
			});

			it("Should return 'other' key items for special input", () => {
				const result = stringStoreSystem.loader(state, "#test");
				expect(result).toEqual(["#crazy", "1start"]);
			});
		});
	});

	// -------------------------------
	// .remove
	// -------------------------------
	describe("[.remove]", () => {
		describe("[PASS]", () => {
			it("Should remove item from correct key", () => {
				const state = {
					a: new Set(["apple", "avocado"]),
					b: new Set(["banana"]),
					o: new Set(["orange"])
				};
				const result = stringStoreSystem.remove(state, ["banana", "avocado"]);
				expect(result).toEqual({
					a: new Set(["apple"]),
					b: new Set(),
					o: new Set(["orange"])
				});
			});

			it("Should not crash when removing non-existing item", () => {
				const state = {
					a: new Set(["apple"])
				};
				const result = stringStoreSystem.remove(state, ["unknown"]);
				expect(result).toEqual({
					a: new Set(["apple"])
				});
			});

			it("Should remove from 'other' key", () => {
				const state = {
					other: new Set(["#x", "1x"])
				};
				const result = stringStoreSystem.remove(state, ["#x"]);
				expect(result).toEqual({
					other: new Set(["1x"])
				});
			});

			it("Should do nothing if suggestion list is empty", () => {
				const state = {
					a: new Set(["apple"])
				};
				const result = stringStoreSystem.remove(state, []);
				expect(result).toEqual({
					a: new Set(["apple"])
				});
			});

			it("Should handle full deletion of all items from a key", () => {
				const state = {
					b: new Set(["banana"])
				};
				const result = stringStoreSystem.remove(state, ["banana"]);
				expect(result).toEqual({
					b: new Set()
				});
			});
		});
	});
});
