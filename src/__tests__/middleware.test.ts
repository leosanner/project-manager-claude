/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { middleware, config } from "@/middleware";

function createRequest(
  path: string,
  options?: { authenticated?: boolean }
): NextRequest {
  const url = new URL(path, "http://localhost:3000");
  const req = new NextRequest(url);
  if (options?.authenticated) {
    req.cookies.set("better-auth.session_token", "fake-token");
  }
  return req;
}

function mockValidSession() {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ session: { id: "s1", userId: "u1" } }),
  });
}

function mockInvalidSession() {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ session: null }),
  });
}

function mockFetchError() {
  global.fetch = jest.fn().mockRejectedValue(new Error("network error"));
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe("auth middleware", () => {
  describe("route matcher", () => {
    it("matches dashboard routes", () => {
      expect(config.matcher).toContain("/dashboard/:path*");
    });

    it("matches signin route", () => {
      expect(config.matcher).toContain("/signin");
    });
  });

  describe("unauthenticated user (no cookie)", () => {
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

      expect(response.status).toBe(200);
    });

    it("does not call fetch when there is no cookie", async () => {
      const fetchSpy = jest.fn();
      global.fetch = fetchSpy;

      await middleware(createRequest("/signin"));

      expect(fetchSpy).not.toHaveBeenCalled();
      delete (global as Record<string, unknown>).fetch;
    });
  });

  describe("authenticated user (valid session)", () => {
    beforeEach(() => mockValidSession());

    it("allows access to /dashboard", async () => {
      const request = createRequest("/dashboard", { authenticated: true });
      const response = await middleware(request);

      expect(response.status).toBe(200);
    });

    it("redirects to /dashboard when accessing /signin", async () => {
      const request = createRequest("/signin", { authenticated: true });
      const response = await middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/dashboard"
      );
    });
  });

  describe("stale cookie (invalid session)", () => {
    beforeEach(() => mockInvalidSession());

    it("redirects to /signin when accessing /dashboard with stale cookie", async () => {
      const request = createRequest("/dashboard", { authenticated: true });
      const response = await middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/signin"
      );
    });

    it("allows access to /signin with stale cookie (no redirect loop)", async () => {
      const request = createRequest("/signin", { authenticated: true });
      const response = await middleware(request);

      expect(response.status).toBe(200);
    });

    it("deletes the stale cookie from the response", async () => {
      const request = createRequest("/dashboard", { authenticated: true });
      const response = await middleware(request);

      const setCookie = response.headers.get("set-cookie") ?? "";
      expect(setCookie).toContain("better-auth.session_token");
      expect(setCookie).toMatch(/Max-Age=0|Expires=Thu, 01 Jan 1970/);
    });
  });

  describe("fetch error during validation", () => {
    beforeEach(() => mockFetchError());

    it("treats fetch failure as invalid session", async () => {
      const request = createRequest("/dashboard", { authenticated: true });
      const response = await middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/signin"
      );
    });

    it("deletes cookie on fetch failure", async () => {
      const request = createRequest("/signin", { authenticated: true });
      const response = await middleware(request);

      const setCookie = response.headers.get("set-cookie") ?? "";
      expect(setCookie).toContain("better-auth.session_token");
    });
  });
});
