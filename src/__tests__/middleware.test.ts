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

describe("auth middleware", () => {
  describe("route matcher", () => {
    it("matches dashboard routes", () => {
      expect(config.matcher).toContain("/dashboard/:path*");
    });

    it("matches signin route", () => {
      expect(config.matcher).toContain("/signin");
    });
  });

  describe("unauthenticated user", () => {
    it("redirects to /signin when accessing /dashboard", () => {
      const request = createRequest("/dashboard");
      const response = middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/signin"
      );
    });

    it("redirects to /signin when accessing /dashboard/projects", () => {
      const request = createRequest("/dashboard/projects");
      const response = middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/signin"
      );
    });

    it("allows access to /signin", () => {
      const request = createRequest("/signin");
      const response = middleware(request);

      expect(response.status).toBe(200);
    });
  });

  describe("authenticated user", () => {
    it("allows access to /dashboard", () => {
      const request = createRequest("/dashboard", { authenticated: true });
      const response = middleware(request);

      expect(response.status).toBe(200);
    });

    it("redirects to /dashboard when accessing /signin", () => {
      const request = createRequest("/signin", { authenticated: true });
      const response = middleware(request);

      expect(response.status).toBe(307);
      expect(response.headers.get("location")).toBe(
        "http://localhost:3000/dashboard"
      );
    });
  });
});
