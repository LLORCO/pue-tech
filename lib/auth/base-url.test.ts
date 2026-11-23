import { it, expect } from "vitest";
import { authBaseURL } from "./base-url";

it("confía en SITE_URL y en los hosts de Vercel", () => {
  expect(
    authBaseURL({
      SITE_URL: "https://pue-tech.vercel.app",
      VERCEL_URL: "pue-tech-abc123.vercel.app",
      VERCEL_BRANCH_URL: "pue-tech-git-rama.vercel.app",
    }),
  ).toEqual({
    allowedHosts: ["pue-tech.vercel.app", "pue-tech-abc123.vercel.app", "pue-tech-git-rama.vercel.app"],
    fallback: "https://pue-tech.vercel.app",
  });
});

it("conserva el puerto local y omite variables vacías o repetidas", () => {
  expect(authBaseURL({ SITE_URL: "http://localhost:3100", VERCEL_URL: "", VERCEL_BRANCH_URL: "localhost:3100" })).toEqual({
    allowedHosts: ["localhost:3100"],
    fallback: "http://localhost:3100",
  });
});

it("sin ninguna variable no arma una lista vacía", () => {
  expect(authBaseURL({})).toBeUndefined();
});
