import { testObject } from "@/importTest/importTest";

describe("Jest Imports Resolver Status", () => {
  it("should import a dummy object from another folder with typescript paths(@/module) syntax", () => {
    const { passPhrase } = testObject;

    expect(passPhrase).toBe("I Let it In and It Took Everything");
  });
});
