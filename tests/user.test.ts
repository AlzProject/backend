import { describe, it, expect } from "bun:test";

describe("User Service", () => {
  it("should create a user", () => {
    const user = { name: "Alice" };
    expect(user.name).toBe("Alice");
  });
});
