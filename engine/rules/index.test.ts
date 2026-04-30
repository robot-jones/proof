import { describe, it, expect } from "vitest";
import { rules } from "./index";

describe("rules", () => {
  it("is enumerable", () => {
    expect(Array.isArray(rules)).toBe(true);
  });

  it("every rule has required fields", () => {
    for (const rule of rules) {
      expect(typeof rule.id).toBe("string");
      expect(typeof rule.description).toBe("string");
      expect([1, 2, 3]).toContain(rule.tier);
      expect(typeof rule.validate).toBe("function");
    }
  });
});
