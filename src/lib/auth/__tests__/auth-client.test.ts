/**
 * @jest-environment node
 */
import { authClient } from "@/lib/auth/auth-client";

describe("auth client", () => {
  it("exports an authClient instance", () => {
    expect(authClient).toBeDefined();
  });

  it("has signIn.social method", () => {
    expect(authClient.signIn).toBeDefined();
    expect(authClient.signIn.social).toBeInstanceOf(Function);
  });

  it("has useSession hook", () => {
    expect(authClient.useSession).toBeInstanceOf(Function);
  });

  it("has signOut method", () => {
    expect(authClient.signOut).toBeInstanceOf(Function);
  });
});
