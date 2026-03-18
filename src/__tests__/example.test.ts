describe("example", () => {
  it("adds two numbers", () => {
    expect(1 + 2).toBe(3);
  });

  it("checks truthy values", () => {
    expect("hello").toBeTruthy();
    expect(0).toBeFalsy();
  });
});
