/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

// Mock next/headers
const mockHeaders = jest.fn();
jest.mock("next/headers", () => ({
  headers: () => mockHeaders(),
}));

// Mock auth
const mockGetSession = jest.fn();
jest.mock("@/lib/auth/auth", () => ({
  auth: {
    api: {
      getSession: (...args: unknown[]) => mockGetSession(...args),
    },
  },
}));

// Import after mocks
import { middleware, config } from "@/middleware";

function createRequest(path: string): NextRequest {
  return new NextRequest(new URL(path, "http://localhost:3000"));
}

describe("auth middleware", () => {
  beforeEach(() => {
    mockGetSession.mockReset();
    mockHeaders.mockReturnValue(new Headers());
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
      mockGetSession.mockResolvedValue(null);
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
      mockGetSession.mockResolvedValue({ user: { id: "1", name: "Test" } });
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
