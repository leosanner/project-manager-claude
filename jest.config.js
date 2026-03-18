import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jest-environment-jsdom",
  globalSetup: "<rootDir>/jest.global-setup.ts",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/*.test.[jt]s?(x)"],
};

// next/jest adds its own transformIgnorePatterns that block ESM packages.
// We override the resolved config to also allow better-auth through the transform.
const baseConfig = createJestConfig(config);

export default async () => {
  const resolved = await baseConfig();
  resolved.transformIgnorePatterns = [
    "/node_modules/(?!(better-auth|@better-auth|nanostores|nanoevents)/)",
    "^.+\\.module\\.(css|sass|scss)$",
  ];
  return resolved;
};
