import { describe, expect, expectTypeOf, it } from "vitest";
import { getTypedArray } from "./arrayUtils";

describe("Array Utils", () => {
  describe("getTypedArray", () => {
    it("returns an empty array", () => {
      const result = getTypedArray<number>();

      expect(result).toEqual([]);
    });

    it("returns different array each time", () => {
      const result1 = getTypedArray<number>();
      const result2 = getTypedArray<number>();

      expect(result1).not.toBe(result2);
      expect(result1).toStrictEqual(result2);
    });

    it("correctly infers the type", () => {
      const result = getTypedArray<string>();

      type expectedType = string[];

      expectTypeOf(result).toEqualTypeOf<expectedType>();
    });
  });
});
