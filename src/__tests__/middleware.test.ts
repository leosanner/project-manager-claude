/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

// Mock better-auth/cookies
const mockGetSessionCookie = jest.fn();
jest.mock("better-auth/cookies", () => ({
  getSessionCookie: (...args: unknown[]) => mockGetSessionCookie(...args),
}));

// Import after mocks
import { middleware, config } from "@/middleware";

function createRequest(path: string): NextRequest {
  return new NextRequest(new URL(path, "http://localhost:3000"));
}

describe("auth middleware", () => {
  beforeEach(() => {
    mockGetSessionCookie.mockReset();
  });

  describe("route matcher", () => {
    it("matches dashboard routes", () => {
      expect(config.matcher).toContain("/dashboard/:path*");
    });

    it("matches signin route", () => {
      expect(config.matcher).toContain("/signin");
    });
  });

  describe("unauthenticated user", () => {
    beforeEach(() => {
      mockGetSessionCookie.mockReturnValue(null);
    });

    it("redirects to /signin when accessing /dashboard", async () => {
      const request = createRequest("/dashboard");
      const response = await middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/signin"
      );
    });

    it("redirects to /signin when accessing /dashboard/projects", async () => {
      const request = createRequest("/dashboard/projects");
      const response = await middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/signin"
      );
    });

    it("allows access to /signin", async () => {
      const request = createRequest("/signin");
      const response = await middleware(request);

      // Should not redirect — NextResponse.next() returns 200
      expect(response.status).toBe(200);
    });
  });

  describe("authenticated user", () => {
    beforeEach(() => {
      mockGetSessionCookie.mockReturnValue("session-token-value");
    });

    it("allows access to /dashboard", async () => {
      const request = createRequest("/dashboard");
      const response = await middleware(request);

      expect(response.status).toBe(200);
    });

    it("redirects to /dashboard when accessing /signin", async () => {
      const request = createRequest("/signin");
      const response = await middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/dashboard"
      );
    });
  });
});
