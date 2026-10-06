import { describe, expect, it } from "vitest";
import en from "./en";
import hi from "./hi";
import or from "./or";

describe("locales", () => {
  it("keeps Hindi and Odia aligned with English", () => {
    expect(Object.keys(hi).sort()).toEqual(Object.keys(en).sort());
    expect(Object.keys(or).sort()).toEqual(Object.keys(en).sort());
  });
});
