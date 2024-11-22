import { describe, expect, it } from "vitest";
import { rules } from "./formUtils";

const { required, email, minLength } = rules;

describe("Validation Utils", () => {
  describe("required", () => {
    it("returns true for non-empty values", () => {
      expect(required("some value")).toBe(true);
    });

    it("returns 'Required.' for empty values", () => {
      expect(required("")).toBe("Required.");
    });
  });

  describe("email", () => {
    it("returns true for valid email addresses", () => {
      expect(email("test@example.com")).toBe(true);
      expect(email("user.name@domain.co")).toBe(true);
    });

    it("returns 'E-mail must be valid.' for invalid email addresses", () => {
      expect(email("invalid-email")).toBe("E-mail must be valid.");
      expect(email("user@domain")).toBe("E-mail must be valid.");
      expect(email("@domain.com")).toBe("E-mail must be valid.");
    });
  });

  describe("minLength", () => {
    it("returns true for values meeting or exceeding the minimum length", () => {
      expect(minLength("123456")).toBe(true);
      expect(minLength("123456789")).toBe(true);
    });

    it("returns 'Min 6 characters.' for values shorter than the minimum length", () => {
      expect(minLength("12345")).toBe("Min 6 characters.");
      expect(minLength("")).toBe("Min 6 characters.");
    });
  });
});
